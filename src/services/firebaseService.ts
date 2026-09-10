import { 
  ref, 
  get, 
  set, 
  push, 
  update, 
  remove, 
  query, 
  orderByChild, 
  equalTo, 
  limitToFirst,
  onValue 
} from 'firebase/database';
import { db, isFirebaseConfigured } from '../lib/firebase';

export interface ClassRecord {
  id: string;
  guru_id?: string;
  nama_sekolah: string;
  nama_kelas: string;
  kod_kelas: string;
  nama_guru?: string;
  avatar_sekolah?: string;
  aktif: boolean;
  dicipta_pada: string;
}

export interface FamilyRecord {
  id: string;
  parent_id?: string;
  nama_keluarga: string;
  kod_keluarga: string;
  nama_ibubapa?: string;
  no_telefon?: string;
  aktif: boolean;
  dicipta_pada: string;
}

export interface StudentRecord {
  id: string;
  nama: string;
  no_mykid?: string;
  guru_id?: string;
  guru_email?: string;
  parent_id?: string;
  parent_email?: string;
  kelas_id?: string;
  kod_kelas?: string;
  nama_kelas?: string;
  keluarga_id?: string;
  kod_keluarga?: string;
  nama_keluarga?: string;
  avatar_url?: string;
  total_bintang: number;
  pin_keselamatan?: string;
  catatan?: string;
  scores?: Record<string, number>;
  stars?: Record<string, number>;
  latihan?: Record<string, boolean>;
  badges?: string[];
  dicipta_pada?: string;
  dikemaskini_pada?: string;
}

export interface ScoreRecord {
  id?: string;
  student_id: string;
  modul: string;
  aktiviti_nama: string;
  skor: number;
  bintang: number;
  data_tambahan?: any;
  tarikh?: string;
}

/**
 * Helper: Menukar RTDB DataSnapshot kepada array objek yang mengandungi property 'id'
 */
function snapToArray<T = any>(snap: any): (T & { id: string })[] {
  const list: (T & { id: string })[] = [];
  if (snap && snap.exists()) {
    snap.forEach((child: any) => {
      list.push({ id: child.key, ...child.val() });
    });
  }
  return list;
}

/**
 * Menguji sambungan langsung ke Firebase Realtime Database
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  if (!isFirebaseConfigured) {
    return {
      success: false,
      message: 'Firebase belum dikonfigurasikan.',
    };
  }

  try {
    const q = query(ref(db, 'classes'), limitToFirst(1));
    const snap = await get(q);
    return {
      success: true,
      message: 'Berjaya bersambung ke Firebase Realtime Database!',
      data: snapToArray(snap),
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Ralat sambungan Firebase RTDB: ${err?.message || 'Tidak diketahui'}`,
    };
  }
}

/**
 * Mendapatkan maklumat kelas berdasarkan kod kelas (contoh: KELAS#01 atau ABCD@123)
 */
export async function getClassByCode(kodKelas: string): Promise<ClassRecord | null> {
  if (!kodKelas) return null;

  try {
    const clean = kodKelas.trim().toUpperCase();
    const q = query(ref(db, 'classes'), orderByChild('kod_kelas'), equalTo(clean));
    const snap = await get(q);
    if (!snap.exists()) return null;

    let found: ClassRecord | null = null;
    snap.forEach(child => {
      const data = child.val();
      if (data.aktif !== false) {
        found = { id: child.key!, ...data } as ClassRecord;
      }
    });
    return found;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat mendapatkan kelas:', err);
    return null;
  }
}

/**
 * Mendapatkan maklumat keluarga berdasarkan kod keluarga (contoh: FAM#1234 atau FAM@2026)
 */
export async function getFamilyByCode(kodKeluarga: string): Promise<FamilyRecord | null> {
  if (!kodKeluarga) return null;

  try {
    const clean = kodKeluarga.trim().toUpperCase();
    const q = query(ref(db, 'families'), orderByChild('kod_keluarga'), equalTo(clean));
    const snap = await get(q);
    if (!snap.exists()) return null;

    let found: FamilyRecord | null = null;
    snap.forEach(child => {
      const data = child.val();
      if (data.aktif !== false) {
        found = { id: child.key!, ...data } as FamilyRecord;
      }
    });
    return found;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat mendapatkan keluarga:', err);
    return null;
  }
}

/**
 * Menjana kod unik mengikut peranan
 */
export function generateUniqueCode(prefix: 'GURU' | 'FAM' = 'GURU'): string {
  if (prefix === 'GURU') {
    const num = Math.floor(100 + Math.random() * 900);
    return `GURU#${num}`;
  } else {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `FAM#${num}`;
  }
}

/**
 * Memeriksa sama ada sesuatu kod (kod kelas, kod keluarga, atau kod admin)
 * telah digunakan oleh guru lain atau keluarga lain di Firebase Realtime Database
 */
export async function checkIsCodeAlreadyUsedInFirebase(
  newCode: string,
  currentRole: 'guru' | 'ibubapa' | 'admin',
  currentUserId?: string,
  excludeClassOrFamilyKey?: string
): Promise<{ isUsed: boolean; usedBy?: string }> {
  const code = (newCode || '').trim().toUpperCase();
  if (!code) return { isUsed: false };

  // 1. Sekatan Kod Sistem / Admin
  const kAdm = (localStorage.getItem('bunyiKataKodAdmin') || '').toUpperCase();
  if (currentRole !== 'admin') {
    if (code === 'ADMIN' || (kAdm && code === kAdm)) {
      return { isUsed: true, usedBy: 'Akaun Admin' };
    }
  }

  const userId = currentUserId || localStorage.getItem('bunyiKataUserId') || '';

  // 2. Semakan pantas localStorage tempatan (kelas lain milik guru yang sama / mod keluarga)
  const kGuru1 = (localStorage.getItem('bunyiKataKodKelas') || '').toUpperCase();
  const kGuru2 = (localStorage.getItem('bunyiKataKodKelas2') || '').toUpperCase();
  const kFam1 = (localStorage.getItem('bunyiKataKodKeluarga') || '').toUpperCase();

  if (currentRole === 'guru') {
    if (excludeClassOrFamilyKey === 'kelas1' && kGuru2 && code === kGuru2) {
      return { isUsed: true, usedBy: 'Kelas Kedua Anda' };
    }
    if (excludeClassOrFamilyKey === 'kelas2' && kGuru1 && code === kGuru1) {
      return { isUsed: true, usedBy: 'Kelas Pertama Anda' };
    }
    if (kFam1 && code === kFam1) {
      return { isUsed: true, usedBy: 'Mod Ibu Bapa (Kod Keluarga)' };
    }
  } else if (currentRole === 'ibubapa') {
    if ((kGuru1 && code === kGuru1) || (kGuru2 && code === kGuru2)) {
      return { isUsed: true, usedBy: 'Mod Guru (Kod Kelas)' };
    }
  }

  try {
    // 3. Semak dalam koleksi 'classes' (Semua kod kelas guru di Firebase)
    const qClass = query(ref(db, 'classes'), orderByChild('kod_kelas'), equalTo(code));
    const snapClass = await get(qClass);
    if (snapClass.exists()) {
      let conflict = false;
      let conflictName = '';
      snapClass.forEach(child => {
        const c = child.val();
        if (currentRole === 'guru') {
          // Jika kelas kepunyaan guru ini sendiri
          if (c.guru_id && userId && c.guru_id === userId) {
            // Periksa sama ada kod ini bertembung dengan kelas lain guru ini
            if (excludeClassOrFamilyKey === 'kelas1' && (c.kod_kelas === kGuru2 || child.key !== excludeClassOrFamilyKey)) {
              conflict = true;
              conflictName = `Kelas Kedua Anda ("${c.nama_kelas || 'Kelas'}")`;
            } else if (excludeClassOrFamilyKey === 'kelas2' && (c.kod_kelas === kGuru1 || child.key !== excludeClassOrFamilyKey)) {
              conflict = true;
              conflictName = `Kelas Pertama Anda ("${c.nama_kelas || 'Kelas'}")`;
            }
          } else {
            // Milik guru lain
            conflict = true;
            conflictName = c.nama_guru ? `Guru Lain (${c.nama_guru})` : 'Guru Lain';
          }
        } else {
          // Mod Ibu Bapa / Admin cuba guna kod kelas guru
          conflict = true;
          conflictName = c.nama_guru ? `Guru (${c.nama_guru})` : 'Mod Guru (Kod Kelas)';
        }
      });

      if (conflict) {
        return { isUsed: true, usedBy: conflictName };
      }
    }

    // 4. Semak dalam koleksi 'families' (Semua kod keluarga ibu bapa di Firebase)
    const qFam = query(ref(db, 'families'), orderByChild('kod_keluarga'), equalTo(code));
    const snapFam = await get(qFam);
    if (snapFam.exists()) {
      let conflict = false;
      let conflictName = '';
      snapFam.forEach(child => {
        const f = child.val();
        if (currentRole === 'ibubapa') {
          if (f.parent_id && userId && f.parent_id === userId) {
            // Milik akaun ibu bapa ini sendiri, dibenarkan jika kod keluarga sendiri
          } else {
            conflict = true;
            conflictName = f.nama_keluarga ? `Keluarga Lain (${f.nama_keluarga})` : 'Keluarga Lain';
          }
        } else {
          // Mod Guru / Admin cuba guna kod keluarga
          conflict = true;
          conflictName = f.nama_keluarga ? `Keluarga (${f.nama_keluarga})` : 'Mod Ibu Bapa (Kod Keluarga)';
        }
      });

      if (conflict) {
        return { isUsed: true, usedBy: conflictName };
      }
    }

    return { isUsed: false };
  } catch (err) {
    console.warn('[Firebase RTDB] checkIsCodeAlreadyUsedInFirebase error:', err);
    return { isUsed: false };
  }
}

export async function getClassCountByGuruId(guruId: string): Promise<number> {
  const classes = await getTeacherClasses(guruId);
  return classes.length;
}

/**
 * Menyimpan maklumat kelas ke Realtime Database
 */
export async function saveClassToFirebase(classData: {
  kodKelas: string;
  namaKelas: string;
  namaSekolah: string;
  namaGuru?: string;
  guruId?: string;
}): Promise<ClassRecord | null> {
  if (!classData.kodKelas) return null;

  try {
    const cleanCode = classData.kodKelas.trim().toUpperCase();
    let guruId = classData.guruId || localStorage.getItem('bunyiKataUserId') || '';

    // Semak sama ada kelas dengan kod ini sudah wujud
    const q = query(ref(db, 'classes'), orderByChild('kod_kelas'), equalTo(cleanCode));
    const snap = await get(q);

    const now = new Date().toISOString();
    const payload = {
      kod_kelas: cleanCode,
      nama_kelas: classData.namaKelas.trim().toUpperCase(),
      nama_sekolah: classData.namaSekolah.trim().toUpperCase(),
      nama_guru: classData.namaGuru?.trim().toUpperCase() || '',
      guru_id: guruId || null,
      aktif: true,
      dikemaskini_pada: now,
    };

    if (snap.exists()) {
      let existingKey = '';
      let existingDicipta = now;
      snap.forEach(child => {
        existingKey = child.key!;
        existingDicipta = child.val()?.dicipta_pada || now;
      });
      await update(ref(db, `classes/${existingKey}`), payload);
      return { id: existingKey, dicipta_pada: existingDicipta, ...payload } as ClassRecord;
    } else {
      const newRef = push(ref(db, 'classes'));
      await set(newRef, {
        ...payload,
        dicipta_pada: now,
      });
      return { id: newRef.key!, dicipta_pada: now, ...payload } as ClassRecord;
    }
  } catch (err) {
    console.error('[Firebase RTDB] Exception saveClassToFirebase:', err);
    return null;
  }
}

/**
 * Mendapatkan senarai semua kelas milik seorang guru dari Realtime Database
 */
export async function getTeacherClasses(guruIdOrEmail: string): Promise<ClassRecord[]> {
  if (!guruIdOrEmail) return [];
  try {
    let guruId = guruIdOrEmail;
    // Jika input adalah emel, cari uid guru dari profiles
    if (guruIdOrEmail.includes('@')) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(guruIdOrEmail.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => {
          guruId = c.key!;
        });
      }
    }

    const q = query(ref(db, 'classes'), orderByChild('guru_id'), equalTo(guruId));
    const snap = await get(q);
    const classes = snapToArray<ClassRecord>(snap);
    classes.sort((a, b) => (a.dicipta_pada || '').localeCompare(b.dicipta_pada || ''));
    return classes;
  } catch (err) {
    console.error('[Firebase RTDB] Exception getTeacherClasses:', err);
    return [];
  }
}

/**
 * Mengemaskini maklumat kelas sedia ada di Realtime Database
 */
export async function updateClassInFirebase(params: {
  classId?: string;
  oldKodKelas?: string;
  newKodKelas: string;
  namaKelas: string;
  namaSekolah: string;
  namaGuru?: string;
  guruId?: string;
}): Promise<ClassRecord | null> {
  const cleanNew = params.newKodKelas.trim().toUpperCase();
  const now = new Date().toISOString();

  try {
    if (params.classId) {
      await update(ref(db, `classes/${params.classId}`), {
        kod_kelas: cleanNew,
        nama_kelas: params.namaKelas.trim().toUpperCase(),
        nama_sekolah: params.namaSekolah.trim().toUpperCase(),
        nama_guru: params.namaGuru?.trim().toUpperCase() || '',
        dikemaskini_pada: now,
        aktif: true,
      });
      const d = await get(ref(db, `classes/${params.classId}`));
      return { id: d.key!, ...d.val() } as ClassRecord;
    }

    if (params.oldKodKelas) {
      const cleanOld = params.oldKodKelas.trim().toUpperCase();
      const q = query(ref(db, 'classes'), orderByChild('kod_kelas'), equalTo(cleanOld));
      const snap = await get(q);
      if (snap.exists()) {
        let targetId = '';
        snap.forEach(c => { targetId = c.key!; });
        await update(ref(db, `classes/${targetId}`), {
          kod_kelas: cleanNew,
          nama_kelas: params.namaKelas.trim().toUpperCase(),
          nama_sekolah: params.namaSekolah.trim().toUpperCase(),
          nama_guru: params.namaGuru?.trim().toUpperCase() || '',
          dikemaskini_pada: now,
          aktif: true,
        });
        const d = await get(ref(db, `classes/${targetId}`));
        return { id: d.key!, ...d.val() } as ClassRecord;
      }
    }

    return await saveClassToFirebase({
      kodKelas: cleanNew,
      namaKelas: params.namaKelas,
      namaSekolah: params.namaSekolah,
      namaGuru: params.namaGuru,
      guruId: params.guruId,
    });
  } catch (err) {
    console.error('[Firebase RTDB] Exception updateClassInFirebase:', err);
    return null;
  }
}

/**
 * Menyegerakkan kelas guru daripada Realtime Database ke localStorage
 */
export async function syncTeacherClasses(emailOrId: string): Promise<ClassRecord[]> {
  try {
    const classes = await getTeacherClasses(emailOrId);
    if (classes && classes.length > 0) {
      const c1 = classes[0];
      localStorage.setItem('bunyiKataKodKelas', c1.kod_kelas);
      localStorage.setItem('bunyiKataNamaKelas', c1.nama_kelas);
      localStorage.setItem('bunyiKataNamaSekolah', c1.nama_sekolah);
      localStorage.setItem('pdf_sekolah', c1.nama_sekolah);
      if (c1.nama_guru) {
        localStorage.setItem('bunyiKataNamaGuru', c1.nama_guru);
        localStorage.setItem('pdf_guru', c1.nama_guru);
      }

      if (classes[1]) {
        const c2 = classes[1];
        localStorage.setItem('bunyiKataKodKelas2', c2.kod_kelas);
        localStorage.setItem('bunyiKataNamaKelas2', c2.nama_kelas);
      } else {
        localStorage.removeItem('bunyiKataKodKelas2');
        localStorage.removeItem('bunyiKataNamaKelas2');
      }

      const classNames = classes.map(c => c.nama_kelas);
      localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(classNames));
      console.log('[Firebase RTDB] Kelas guru berjaya disegerakkan:', classes);
    }
    return classes;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat syncTeacherClasses:', err);
    return [];
  }
}

/**
 * Menyimpan maklumat keluarga ke Realtime Database
 */
export async function saveFamilyToFirebase(familyData: {
  kodKeluarga: string;
  namaKeluarga: string;
  namaIbubapa?: string;
  parentId?: string;
  oldKodKeluarga?: string;
}): Promise<FamilyRecord | null> {
  if (!familyData.kodKeluarga) return null;

  try {
    const cleanCode = familyData.kodKeluarga.trim().toUpperCase();
    const parentId = familyData.parentId || localStorage.getItem('bunyiKataUserId') || '';
    const now = new Date().toISOString();

    const payload = {
      kod_keluarga: cleanCode,
      nama_keluarga: familyData.namaKeluarga.trim().toUpperCase(),
      nama_ibubapa: familyData.namaIbubapa?.trim() || '',
      parent_id: parentId || null,
      aktif: true,
      dikemaskini_pada: now,
    };

    let existingDocId: string | null = null;
    if (parentId) {
      const q = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(parentId));
      const snap = await get(q);
      if (snap.exists()) {
        snap.forEach(c => { existingDocId = c.key!; });
      }
    }

    if (!existingDocId && familyData.oldKodKeluarga) {
      const q = query(ref(db, 'families'), orderByChild('kod_keluarga'), equalTo(familyData.oldKodKeluarga.trim().toUpperCase()));
      const snap = await get(q);
      if (snap.exists()) {
        snap.forEach(c => { existingDocId = c.key!; });
      }
    }

    // Kemas kini profil ibu bapa jika parentId wujud
    if (parentId) {
      try {
        await update(ref(db, `profiles/${parentId}`), {
          nama_keluarga: familyData.namaKeluarga.trim().toUpperCase(),
          dikemaskini_pada: now,
        });
      } catch (pErr) {}
    }

    if (existingDocId) {
      await update(ref(db, `families/${existingDocId}`), payload);
      const d = await get(ref(db, `families/${existingDocId}`));
      return { id: d.key!, ...d.val() } as FamilyRecord;
    } else {
      const newRef = push(ref(db, 'families'));
      await set(newRef, {
        ...payload,
        dicipta_pada: now,
      });
      return { id: newRef.key!, dicipta_pada: now, ...payload } as FamilyRecord;
    }
  } catch (err) {
    console.error('[Firebase RTDB] Exception saveFamilyToFirebase:', err);
    return null;
  }
}

/**
 * Menyegerakkan keluarga ibu bapa daripada Realtime Database ke localStorage
 */
export async function syncParentFamily(emailOrId: string): Promise<FamilyRecord | null> {
  try {
    let parentId = emailOrId;
    if (emailOrId.includes('@')) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(emailOrId.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => { parentId = c.key!; });
      }
    }

    const q = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(parentId));
    const snap = await get(q);
    if (!snap.exists()) return null;

    let f: FamilyRecord | null = null;
    snap.forEach(c => {
      f = { id: c.key!, ...c.val() } as FamilyRecord;
    });

    if (f) {
      localStorage.setItem('bunyiKataKodKeluarga', (f as FamilyRecord).kod_keluarga);
      localStorage.setItem('bunyiKataNamaKeluarga', (f as FamilyRecord).nama_keluarga);
    }
    return f;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat syncParentFamily:', err);
    return null;
  }
}

/**
 * Mendapatkan senarai murid dalam sesebuah kelas
 */
export async function getStudentsByClassId(classId: string): Promise<StudentRecord[]> {
  if (!classId) return [];
  const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
  try {
    const q = query(ref(db, 'students'), orderByChild('kelas_id'), equalTo(classId));
    const snap = await get(q);
    return snapToArray<StudentRecord>(snap)
      .filter(s => s.nama && !GHOST_NAMES.includes(s.nama.trim().toLowerCase()));
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getStudentsByClassId:', err);
    return [];
  }
}

/**
 * Mendapatkan senarai anak murid dalam sesebuah keluarga
 */
export async function getStudentsByFamilyId(familyId: string): Promise<StudentRecord[]> {
  if (!familyId) return [];
  const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
  try {
    const q = query(ref(db, 'students'), orderByChild('keluarga_id'), equalTo(familyId));
    const snap = await get(q);
    return snapToArray<StudentRecord>(snap)
      .filter(s => s.nama && !GHOST_NAMES.includes(s.nama.trim().toLowerCase()));
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getStudentsByFamilyId:', err);
    return [];
  }
}

/**
 * Mendapatkan senarai murid berdasarkan kod kelas atau kod keluarga secara universal
 */
export async function getStudentsByCode(code: string): Promise<StudentRecord[]> {
  if (!code) return [];
  const clean = code.trim().toUpperCase();
  const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
  try {
    const list: StudentRecord[] = [];
    const snapAll = await get(ref(db, 'students'));
    if (snapAll.exists()) {
      snapAll.forEach(child => {
        const val = child.val();
        if (val && (
          (val.kod_kelas && val.kod_kelas.toUpperCase() === clean) ||
          (val.kod_keluarga && val.kod_keluarga.toUpperCase() === clean)
        )) {
          list.push({ id: child.key!, ...val });
        }
      });
    }
    return list.filter(s => s.nama && !GHOST_NAMES.includes(s.nama.trim().toLowerCase()));
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getStudentsByCode:', err);
    return [];
  }
}

/**
 * Menyegerakkan rekod murid ke Firebase Realtime Database
 */
export async function syncStudentToFirebase(student: {
  id?: string;
  nama: string;
  noMykid?: string;
  guruId?: string;
  guruEmail?: string;
  parentId?: string;
  parentEmail?: string;
  kelasId?: string;
  keluargaId?: string;
  kodKelas?: string;
  kodKeluarga?: string;
  namaKelas?: string;
  namaKeluarga?: string;
  totalBintang?: number;
  avatarUrl?: string;
  isParentChild?: boolean;
  badges?: string[];
  scores?: Record<string, number>;
  stars?: Record<string, number>;
  latihan?: Record<string, boolean>;
}): Promise<StudentRecord | null> {
  const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
  if (!student.nama || GHOST_NAMES.includes(student.nama.trim().toLowerCase())) {
    console.warn('[Firebase RTDB] Simpanan disekat: nama murid tidak sah atau nama sistem —', student.nama);
    return null;
  }

  const cleanName = student.nama.trim().toUpperCase();
  const teacherName = (localStorage.getItem('bunyiKataNamaGuru') || localStorage.getItem('pdf_guru') || '').trim().toUpperCase();
  if (teacherName && cleanName === teacherName) {
    console.warn('[Firebase RTDB] Simpanan disekat: Nama guru tidak boleh didaftarkan atau disimpan sebagai murid —', cleanName);
    return null;
  }
  const activeUserId = localStorage.getItem('bunyiKataUserId') || '';
  if (student.id && student.id === activeUserId) {
    console.warn('[Firebase RTDB] Simpanan disekat: ID guru tidak boleh digunakan sebagai ID murid —', student.id);
    return null;
  }
  try {
    const now = new Date().toISOString();

    const activeUserId = localStorage.getItem('bunyiKataUserId') || '';
    const activeUserRole = localStorage.getItem('bunyiKataUserRole') || '';
    const activeTeacherEmail = localStorage.getItem('bunyiKataGuruEmail') || '';
    const activeParentEmail = localStorage.getItem('bunyiKataIbubapaEmail') || '';
    let parentChildNamesRaw: string[] = [];
    try {
      parentChildNamesRaw = JSON.parse(localStorage.getItem('bunyiKataParentChildNames') || '[]');
    } catch (e) {}

    const isParentChild = student.isParentChild === true || 
      activeUserRole === 'ibubapa' || 
      localStorage.getItem('bunyiKataIsParentChild') === 'true' ||
      (Array.isArray(parentChildNamesRaw) && parentChildNamesRaw.some((n: string) => n && n.trim().toUpperCase() === cleanName));

    let targetGuruId: string | null = null;
    let targetGuruEmail: string | null = null;
    let targetKelasId: string | null = null;
    let activeKodKelas: string | null = null;
    let activeNamaKelas: string | null = null;

    let targetParentId: string | null = null;
    let targetParentEmail: string | null = null;
    let targetKeluargaId: string | null = null;
    let activeKodFam: string | null = null;
    let activeNamaFam: string | null = null;

    if (!isParentChild) {
      // 100% MOD GURU (MURID KELAS) - Jangan sesekali ambil nama_keluarga / kod_keluarga
      targetGuruId = student.guruId || (activeUserRole === 'guru' ? activeUserId : null);
      targetGuruEmail = student.guruEmail || (activeUserRole === 'guru' ? activeTeacherEmail.toLowerCase() : null);
      targetKelasId = student.kelasId || null;
      activeKodKelas = (student.kodKelas || (activeUserRole === 'guru' ? localStorage.getItem('bunyiKataKodKelas') : '') || '').trim().toUpperCase() || null;
      activeNamaKelas = (student.namaKelas || (activeUserRole === 'guru' ? localStorage.getItem('bunyiKataNamaKelas') : '') || '').trim().toUpperCase() || null;

      if (activeKodKelas) {
        try {
          const qKelas = query(ref(db, 'classes'), orderByChild('kod_kelas'), equalTo(activeKodKelas));
          const snapKelas = await get(qKelas);
          if (snapKelas.exists()) {
            snapKelas.forEach(c => {
              targetKelasId = c.key!;
              const cData = c.val();
              if (!targetGuruId && cData.guru_id) targetGuruId = cData.guru_id;
              if (!activeNamaKelas && cData.nama_kelas) activeNamaKelas = cData.nama_kelas;
            });
          }
        } catch (e) {}
      } else if (targetGuruId) {
        try {
          const qKelas = query(ref(db, 'classes'), orderByChild('guru_id'), equalTo(targetGuruId));
          const snapKelas = await get(qKelas);
          if (snapKelas.exists()) {
            snapKelas.forEach(c => {
              if (!targetKelasId) targetKelasId = c.key!;
              const cData = c.val();
              if (!activeKodKelas) activeKodKelas = cData.kod_kelas || '';
              if (!activeNamaKelas) activeNamaKelas = cData.nama_kelas || '';
            });
          }
        } catch (e) {}
      }
    } else {
      // 100% MOD IBU BAPA (ANAK KELUARGA) - Jangan sesekali ambil nama_kelas / kod_kelas
      targetParentId = student.parentId || (activeUserRole === 'ibubapa' ? activeUserId : null);
      targetParentEmail = student.parentEmail || (activeUserRole === 'ibubapa' ? activeParentEmail.toLowerCase() : null);
      targetKeluargaId = student.keluargaId || null;
      activeKodFam = (student.kodKeluarga || (activeUserRole === 'ibubapa' ? localStorage.getItem('bunyiKataKodKeluarga') : '') || '').trim().toUpperCase() || null;
      activeNamaFam = (student.namaKeluarga || (activeUserRole === 'ibubapa' ? localStorage.getItem('bunyiKataNamaKeluarga') : '') || '').trim().toUpperCase() || null;

      if (activeKodFam) {
        try {
          const qFam = query(ref(db, 'families'), orderByChild('kod_keluarga'), equalTo(activeKodFam));
          const snapFam = await get(qFam);
          if (snapFam.exists()) {
            snapFam.forEach(f => {
              targetKeluargaId = f.key!;
              const fData = f.val();
              if (!targetParentId && fData.parent_id) targetParentId = fData.parent_id;
              if (!activeNamaFam && fData.nama_keluarga) activeNamaFam = fData.nama_keluarga;
            });
          }
        } catch (e) {}
      } else if (targetParentId) {
        try {
          const qFam = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(targetParentId));
          const snapFam = await get(qFam);
          if (snapFam.exists()) {
            snapFam.forEach(f => {
              if (!targetKeluargaId) targetKeluargaId = f.key!;
              const fData = f.val();
              if (!activeKodFam) activeKodFam = fData.kod_keluarga || '';
              if (!activeNamaFam) activeNamaFam = fData.nama_keluarga || '';
            });
          }
        } catch (e) {}
      }
    }

    // Cari jika murid sudah wujud mengikut mod peranan yang betul
    let existingDocId: string | null = student.id || null;
    if (!existingDocId && typeof window !== 'undefined') {
      const activeStuId = localStorage.getItem('bunyiKataStudentId');
      const activeStuName = (localStorage.getItem('muridAktif') || localStorage.getItem('bunyiKataCurrentMurid') || '').trim().toUpperCase();
      if (activeStuId && activeStuName === cleanName) {
        existingDocId = activeStuId;
      }
    }
    if (!existingDocId) {
      if (!isParentChild) {
        if (targetGuruId) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('guru_id'), equalTo(targetGuruId));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
        if (!existingDocId && targetKelasId) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('kelas_id'), equalTo(targetKelasId));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
        if (!existingDocId && activeKodKelas) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('kod_kelas'), equalTo(activeKodKelas));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
      } else {
        if (targetParentId) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('parent_id'), equalTo(targetParentId));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
        if (!existingDocId && targetKeluargaId) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('keluarga_id'), equalTo(targetKeluargaId));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
        if (!existingDocId && activeKodFam) {
          try {
            const qFind = query(ref(db, 'students'), orderByChild('kod_keluarga'), equalTo(activeKodFam));
            const snapFind = await get(qFind);
            if (snapFind.exists()) {
              snapFind.forEach(c => {
                if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
                  existingDocId = c.key!;
                }
              });
            }
          } catch (e) {}
        }
      }
    }

    const payload: any = {
      nama: cleanName,
      no_mykid: student.noMykid || '',
      guru_id: targetGuruId || null,
      guru_email: targetGuruEmail || null,
      parent_id: targetParentId || null,
      parent_email: targetParentEmail || null,
      kelas_id: targetKelasId || null,
      kod_kelas: activeKodKelas || null,
      nama_kelas: activeNamaKelas || null,
      keluarga_id: targetKeluargaId || null,
      kod_keluarga: activeKodFam || null,
      nama_keluarga: activeNamaFam || null,
      dikemaskini_pada: now,
    };
    if (student.avatarUrl) {
      payload.avatar_url = student.avatarUrl;
    }

    if (existingDocId) {
      // Dapatkan data sedia ada dahulu supaya total_bintang / scores / stars tidak ditindih secara sengaja
      try {
        const existSnap = await get(ref(db, `students/${existingDocId}`));
        if (existSnap.exists()) {
          const existVal = existSnap.val();
          payload.total_bintang = Math.max(student.totalBintang || 0, existVal.total_bintang || 0);
          if (existVal.scores) payload.scores = existVal.scores;
          if (existVal.stars) payload.stars = existVal.stars;
          if (existVal.latihan) payload.latihan = existVal.latihan;
          if (existVal.badges) {
            payload.badges = Array.from(new Set([...(existVal.badges || []), ...(student.badges || [])]));
          }
          if (isParentChild) {
            payload.guru_id = null;
            payload.guru_email = null;
            payload.kelas_id = null;
            payload.kod_kelas = null;
            payload.nama_kelas = null;
            if (!payload.parent_id && existVal.parent_id) payload.parent_id = existVal.parent_id;
            if (!payload.keluarga_id && existVal.keluarga_id) payload.keluarga_id = existVal.keluarga_id;
            if (!payload.kod_keluarga && existVal.kod_keluarga) payload.kod_keluarga = existVal.kod_keluarga;
          } else {
            payload.parent_id = null;
            payload.parent_email = null;
            payload.keluarga_id = null;
            payload.kod_keluarga = null;
            payload.nama_keluarga = null;
            if (!payload.guru_id && existVal.guru_id) payload.guru_id = existVal.guru_id;
            if (!payload.kelas_id && existVal.kelas_id) payload.kelas_id = existVal.kelas_id;
            if (!payload.kod_kelas && existVal.kod_kelas) payload.kod_kelas = existVal.kod_kelas;
          }
        } else {
          payload.total_bintang = student.totalBintang || 0;
        }
      } catch (e) {
        payload.total_bintang = student.totalBintang || 0;
      }
      await update(ref(db, `students/${existingDocId}`), payload);
      return { id: existingDocId, dicipta_pada: now, ...payload } as StudentRecord;
    } else {
      payload.total_bintang = student.totalBintang || 0;
      payload.dicipta_pada = now;
      const newRef = push(ref(db, 'students'));
      await set(newRef, payload);
      return { id: newRef.key!, ...payload } as StudentRecord;
    }
  } catch (err) {
    console.error('[Firebase RTDB] Ralat syncStudentToFirebase:', err);
    return null;
  }
}

/**
 * Mengambil senarai murid kepunyaan guru dari Realtime Database berdasarkan guru_id, kelas_id, atau kod_kelas
 */
export async function getStudentsForTeacher(params: {
  guruId?: string;
  guruEmail?: string;
  kodKelas?: string;
  kelasId?: string;
}): Promise<StudentRecord[]> {
  const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
  const studentsMap = new Map<string, StudentRecord>();

  const addSnapToMap = (snap: any) => {
    if (!snap || !snap.exists()) return;
    snap.forEach((c: any) => {
      const data = c.val();
      // Jangan masukkan anak keluarga (Mod Ibu Bapa) ke dalam senarai murid guru
      if ((data.parent_id || data.keluarga_id || data.parent_email) && !data.guru_id && !data.kelas_id) {
        return;
      }
      const nama = (data.nama || '').trim().toUpperCase();
      if (nama && !GHOST_NAMES.includes(nama.toLowerCase())) {
        studentsMap.set(nama, { id: c.key, ...data } as StudentRecord);
      }
    });
  };

  try {
    const guruId = params.guruId || localStorage.getItem('bunyiKataUserId') || '';
    const kodKelas = (params.kodKelas || localStorage.getItem('bunyiKataKodKelas') || '').trim().toUpperCase();
    const kelasId = params.kelasId || '';
    const guruEmail = (params.guruEmail || localStorage.getItem('bunyiKataGuruEmail') || '').trim().toLowerCase();

    // 1. Cari mengikut guru_id
    if (guruId) {
      try {
        const q = query(ref(db, 'students'), orderByChild('guru_id'), equalTo(guruId));
        const snap = await get(q);
        addSnapToMap(snap);
      } catch (e) {}
    }

    // 2. Cari mengikut kelas_id
    if (kelasId) {
      try {
        const q = query(ref(db, 'students'), orderByChild('kelas_id'), equalTo(kelasId));
        const snap = await get(q);
        addSnapToMap(snap);
      } catch (e) {}
    }

    // 3. Cari mengikut kod_kelas
    if (kodKelas) {
      try {
        const q = query(ref(db, 'students'), orderByChild('kod_kelas'), equalTo(kodKelas));
        const snap = await get(q);
        addSnapToMap(snap);
      } catch (e) {}
    }

    // 4. Cari mengikut guru_email
    if (guruEmail) {
      try {
        const q = query(ref(db, 'students'), orderByChild('guru_email'), equalTo(guruEmail));
        const snap = await get(q);
        addSnapToMap(snap);
      } catch (e) {}
    }

    return Array.from(studentsMap.values());
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getStudentsForTeacher:', err);
    return Array.from(studentsMap.values());
  }
}

/**
 * Menyegerakkan sesi guru lengkap (Kelas & Senarai Murid) daripada Realtime Database ke LocalStorage & Window State
 */
export async function syncTeacherSessionFromFirebase(guruIdOrEmail: string): Promise<{
  classes: ClassRecord[];
  students: StudentRecord[];
}> {
  try {
    if (!guruIdOrEmail) return { classes: [], students: [] };

    let guruId = guruIdOrEmail;
    let guruEmail = guruIdOrEmail;
    if (guruIdOrEmail.includes('@')) {
      guruEmail = guruIdOrEmail.trim().toLowerCase();
      try {
        const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(guruEmail));
        const snapUser = await get(qUser);
        if (snapUser.exists()) {
          snapUser.forEach(c => {
            guruId = c.key!;
          });
        }
      } catch (e) {}
    }

    if (guruId) {
      try {
        const pSnap = await get(ref(db, `profiles/${guruId}`));
        if (pSnap.exists()) {
          const pData = pSnap.val();
          if (pData.tarikh_tamat) localStorage.setItem('bunyiKataTarikhTamat', pData.tarikh_tamat);
          if (pData.langganan) localStorage.setItem('bunyiKataTeacherPlan', pData.langganan);
        }
      } catch (e) {}
    }

    // 1. Segerakkan kelas guru
    const classes = await syncTeacherClasses(guruId);

    // 2. Ambil murid bagi semua kelas guru atau mengikut guru_id
    const primaryKodKelas = localStorage.getItem('bunyiKataKodKelas') || (classes[0] ? classes[0].kod_kelas : '');
    const primaryKelasId = classes[0] ? classes[0].id : '';

    const remoteStudents = await getStudentsForTeacher({
      guruId,
      guruEmail,
      kodKelas: primaryKodKelas,
      kelasId: primaryKelasId,
    });

    if (remoteStudents.length > 0) {
      const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
      const teacherName = (localStorage.getItem('bunyiKataNamaGuru') || localStorage.getItem('pdf_guru') || '').trim().toLowerCase();
      const studentNames = remoteStudents
        .map(s => s.nama)
        .filter(n => n && !GHOST_NAMES.includes(n.trim().toLowerCase()) && (n.trim().toLowerCase() !== teacherName));
      localStorage.setItem('bunyiKataStudentNames', JSON.stringify(studentNames));

      let rawLocalData: any = {};
      try {
        rawLocalData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
      } catch (e) {
        rawLocalData = {};
      }

      const idMap: Record<string, string> = {};
      const cleanedStudentData: any = {};
      remoteStudents.forEach(st => {
        if (!st.nama || GHOST_NAMES.includes(st.nama.trim().toLowerCase()) || (st.nama.trim().toLowerCase() === teacherName)) return;
        if (st.id) idMap[st.nama] = st.id;
        const prev = rawLocalData[st.nama] || {};
        const remoteTotal = Number(st.total_bintang !== undefined ? st.total_bintang : (prev.totalBintang || 0));
        cleanedStudentData[st.nama] = {
          id: st.id,
          avatar: st.avatar_url || prev.avatar || '/images/avatar/avatar1.png',
          coins: remoteTotal,
          totalBintang: remoteTotal,
          spentStars: prev.spentStars || 0,
          kelas: st.nama_kelas || prev.kelas || localStorage.getItem('bunyiKataNamaKelas') || '',
          kod_kelas: st.kod_kelas || prev.kod_kelas || '',
          nama_keluarga: st.nama_keluarga || prev.nama_keluarga || '',
          kod_keluarga: st.kod_keluarga || prev.kod_keluarga || '',
          kelas_id: st.kelas_id || prev.kelas_id || '',
          keluarga_id: st.keluarga_id || prev.keluarga_id || '',
          history: prev.history || [],
          badges: (remoteTotal === 0 && (!st.stars || Object.keys(st.stars).length === 0)) ? (st.badges || []) : Array.from(new Set([...(st.badges || []), ...(prev.badges || [])])),
          scores: remoteTotal === 0 ? (st.scores || {}) : { ...(prev.scores || {}), ...(st.scores || {}) },
          stars: remoteTotal === 0 ? (st.stars || {}) : { ...(prev.stars || {}), ...(st.stars || {}) },
          latihan: remoteTotal === 0 ? (st.latihan || {}) : { ...(prev.latihan || {}), ...(st.latihan || {}) },
        };
      });

      // Gabungkan juga skor daripada nod scores/ bagi memastikan data 100% tally
      try {
        const snapScores = await get(ref(db, 'scores'));
        if (snapScores.exists()) {
          const studentIdToNama = new Map<string, string>();
          remoteStudents.forEach(s => {
            if (s.id && s.nama) studentIdToNama.set(s.id, s.nama);
          });
          snapScores.forEach(scoreSnap => {
            const sc = scoreSnap.val();
            if (sc && sc.student_id && studentIdToNama.has(sc.student_id)) {
              const sName = studentIdToNama.get(sc.student_id)!;
              if (cleanedStudentData[sName]) {
                if (!cleanedStudentData[sName].scores) cleanedStudentData[sName].scores = {};
                if (!cleanedStudentData[sName].stars) cleanedStudentData[sName].stars = {};
                if (!cleanedStudentData[sName].latihan) cleanedStudentData[sName].latihan = {};

                const oldSc = cleanedStudentData[sName].scores[sc.aktiviti_nama] || 0;
                const oldSt = cleanedStudentData[sName].stars[sc.aktiviti_nama] || 0;
                cleanedStudentData[sName].scores[sc.aktiviti_nama] = Math.max(oldSc, Number(sc.skor) || 0);
                cleanedStudentData[sName].stars[sc.aktiviti_nama] = Math.max(oldSt, Number(sc.bintang) || 0);
                cleanedStudentData[sName].latihan[sc.aktiviti_nama] = true;
                if (sc.bintang && cleanedStudentData[sName].coins === 0) {
                  cleanedStudentData[sName].coins = Math.max(cleanedStudentData[sName].coins, Number(sc.bintang));
                  cleanedStudentData[sName].totalBintang = Math.max(cleanedStudentData[sName].totalBintang, Number(sc.bintang));
                }
              }
            }
          });
        }
      } catch (scoreErr) {
        console.warn('[Firebase RTDB] Skor merge notice:', scoreErr);
      }

      localStorage.setItem('bunyiKataStudentData', JSON.stringify(cleanedStudentData));
      localStorage.setItem('bunyiKataStudentFirebaseIds', JSON.stringify(idMap));

      if (typeof window !== 'undefined') {
        (window as any).studentNames = studentNames;
        (window as any).studentData = cleanedStudentData;
        (window as any).studentFirebaseIds = idMap;

        if (typeof (window as any).updateStudentDropdown === 'function') {
          (window as any).updateStudentDropdown();
        }
        if (typeof (window as any).renderSenaraiMuridUrus === 'function') {
          (window as any).renderSenaraiMuridUrus();
        }
        if (typeof (window as any).renderTeacherTable === 'function') {
          (window as any).renderTeacherTable();
        }
      }
    }

    return { classes, students: remoteStudents };
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat syncTeacherSessionFromFirebase:', err);
    return { classes: [], students: [] };
  }
}

/**
 * Memadam murid daripada Realtime Database berdasarkan nama dan guruId / kodKelas / parentId
 */
export async function deleteStudentByNameFromFirebase(nama: string, options?: {
  guruId?: string;
  kodKelas?: string;
  parentId?: string;
  kodKeluarga?: string;
}): Promise<boolean> {
  if (!nama) return false;
  try {
    const cleanName = nama.trim().toUpperCase();
    const guruId = options?.guruId || localStorage.getItem('bunyiKataUserId') || '';
    const kodKelas = options?.kodKelas || localStorage.getItem('bunyiKataKodKelas') || '';
    const parentId = options?.parentId || localStorage.getItem('bunyiKataUserId') || '';
    const kodFam = options?.kodKeluarga || localStorage.getItem('bunyiKataKodKeluarga') || '';

    let docsToDelete: string[] = [];

    if (guruId) {
      const q = query(ref(db, 'students'), orderByChild('guru_id'), equalTo(guruId));
      const snap = await get(q);
      snap.forEach(c => {
        if (c.val()?.nama?.trim().toUpperCase() === cleanName) docsToDelete.push(c.key!);
      });
    }
    if (docsToDelete.length === 0 && kodKelas) {
      const q = query(ref(db, 'students'), orderByChild('kod_kelas'), equalTo(kodKelas));
      const snap = await get(q);
      snap.forEach(c => {
        if (c.val()?.nama?.trim().toUpperCase() === cleanName) docsToDelete.push(c.key!);
      });
    }
    if (docsToDelete.length === 0 && parentId) {
      const q = query(ref(db, 'students'), orderByChild('parent_id'), equalTo(parentId));
      const snap = await get(q);
      snap.forEach(c => {
        if (c.val()?.nama?.trim().toUpperCase() === cleanName) docsToDelete.push(c.key!);
      });
    }
    if (docsToDelete.length === 0 && kodFam) {
      const q = query(ref(db, 'students'), orderByChild('kod_keluarga'), equalTo(kodFam));
      const snap = await get(q);
      snap.forEach(c => {
        if (c.val()?.nama?.trim().toUpperCase() === cleanName) docsToDelete.push(c.key!);
      });
    }

    for (const docId of docsToDelete) {
      await remove(ref(db, `students/${docId}`));
    }
    return docsToDelete.length > 0;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat deleteStudentByNameFromFirebase:', err);
    return false;
  }
}

/**
 * Menyimpan skor & bintang aktiviti murid ke Realtime Database
 */
export async function saveScoreToFirebase(scoreData: {
  studentId: string;
  modul: string;
  aktivitiNama: string;
  skor: number;
  bintang: number;
  dataTambahan?: any;
}): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const newScoreRef = push(ref(db, 'scores'));
    await set(newScoreRef, {
      student_id: scoreData.studentId,
      modul: scoreData.modul,
      aktiviti_nama: scoreData.aktivitiNama,
      skor: scoreData.skor,
      bintang: scoreData.bintang,
      data_tambahan: scoreData.dataTambahan || null,
      tarikh: now,
    });

    // Kemas kini skor, bintang modul, dan jumlah bintang dalam rekod murid
    try {
      const sRef = ref(db, `students/${scoreData.studentId}`);
      const sSnap = await get(sRef);
      if (sSnap.exists()) {
        const sVal = sSnap.val() || {};
        const oldScores = sVal.scores || {};
        const oldStars = sVal.stars || {};
        const prevScore = oldScores[scoreData.aktivitiNama] || 0;
        const prevStar = oldStars[scoreData.aktivitiNama] || 0;

        const bestScore = Math.max(prevScore, Number(scoreData.skor) || 0);
        const bestStar = Math.max(prevStar, Number(scoreData.bintang) || 0);
        const starDiff = Math.max(0, bestStar - prevStar);
        const currTotalStars = sVal.total_bintang || 0;

        const updatePayload: any = {
          [`scores/${scoreData.aktivitiNama}`]: bestScore,
          [`stars/${scoreData.aktivitiNama}`]: bestStar,
          [`latihan/${scoreData.aktivitiNama}`]: true,
          dikemaskini_pada: now,
        };
        if (starDiff > 0 || currTotalStars === 0) {
          updatePayload.total_bintang = currTotalStars + (starDiff > 0 ? starDiff : bestStar);
        }

        await update(sRef, updatePayload);

        // Kemaskini juga ke dalam memori studentData setempat jika ada
        if (typeof window !== 'undefined') {
          const sName = sVal.nama;
          const sTarget = (window as any).studentData;
          if (sTarget && sName && sTarget[sName]) {
            if (!sTarget[sName].scores) sTarget[sName].scores = {};
            if (!sTarget[sName].stars) sTarget[sName].stars = {};
            if (!sTarget[sName].latihan) sTarget[sName].latihan = {};
            sTarget[sName].scores[scoreData.aktivitiNama] = bestScore;
            sTarget[sName].stars[scoreData.aktivitiNama] = bestStar;
            sTarget[sName].latihan[scoreData.aktivitiNama] = true;
            if (starDiff > 0 || !sTarget[sName].coins) {
              sTarget[sName].coins = (sTarget[sName].coins || 0) + (starDiff > 0 ? starDiff : bestStar);
              sTarget[sName].totalBintang = (sTarget[sName].totalBintang || 0) + (starDiff > 0 ? starDiff : bestStar);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Ralat kemaskini profil murid semasa simpan skor:', e);
    }
    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat saveScoreToFirebase:', err);
    return false;
  }
}

/**
 * Menyimpan rekod aktiviti murid
 */
export async function recordStudentActivity(
  studentId: string,
  kategori: string,
  aktiviti: string,
  skor: number,
  bintang: number
): Promise<boolean> {
  try {
    if (!studentId) return false;
    return await saveScoreToFirebase({
      studentId: studentId,
      modul: kategori,
      aktivitiNama: aktiviti,
      skor: skor || 0,
      bintang: bintang || 0,
    });
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat recordStudentActivity:', err);
    return false;
  }
}

/**
 * Menyimpan lencana (badge) yang diperoleh murid ke Realtime Database
 */
export async function recordStudentBadge(studentId: string, badgeKey: string): Promise<boolean> {
  try {
    if (!studentId || !badgeKey) return false;
    const now = new Date().toISOString();
    const newBadgeRef = push(ref(db, 'badges'));
    await set(newBadgeRef, {
      student_id: studentId,
      badge_key: badgeKey,
      tarikh: now,
    });

    try {
      const sSnap = await get(ref(db, `students/${studentId}`));
      if (sSnap.exists()) {
        const existingBadges = sSnap.val()?.badges || [];
        if (!existingBadges.includes(badgeKey)) {
          await update(ref(db, `students/${studentId}`), {
            badges: [...existingBadges, badgeKey],
            dikemaskini_pada: now,
          });
        }
      }
    } catch (e) {}
    return true;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat recordStudentBadge:', err);
    return false;
  }
}

/**
 * Menyimpan rekod sijil murid yang dijana ke Realtime Database
 */
export async function saveCertificate(certData: {
  noSiri: string;
  namaMurid: string;
  namaSekolah?: string;
  namaKelas?: string;
  namaGuru?: string;
}): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const newCertRef = push(ref(db, 'certificates'));
    await set(newCertRef, {
      no_siri: certData.noSiri,
      nama_murid: certData.namaMurid.trim().toUpperCase(),
      nama_sekolah: certData.namaSekolah?.trim().toUpperCase() || '',
      nama_kelas: certData.namaKelas?.trim().toUpperCase() || '',
      nama_guru: certData.namaGuru?.trim().toUpperCase() || '',
      tarikh: now,
    });
    return true;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat saveCertificate:', err);
    return false;
  }
}

/**
 * Memuatkan rekod kemajuan murid (bintang, markah, lencana) daripada Realtime Database
 */
export async function fetchStudentProgressFromFirebase(studentName: string, studentId?: string): Promise<any | null> {
  try {
    if (!studentName && !studentId) return null;

    // 1. Jika studentId diberikan, terus muat turun rekod tepat
    if (studentId) {
      try {
        const snap = await get(ref(db, `students/${studentId}`));
        if (snap.exists()) {
          const sData = snap.val();
          return {
            id: snap.key,
            nama: sData.nama,
            totalBintang: sData.total_bintang || 0,
            badges: sData.badges || [],
            scores: sData.scores || {},
            stars: sData.stars || {},
            latihan: sData.latihan || {},
            kelasId: sData.kelas_id,
            keluargaId: sData.keluarga_id,
            kodKelas: sData.kod_kelas,
            kodKeluarga: sData.kod_keluarga,
          };
        }
      } catch (e) {}
    }

    // 2. Jika tiada studentId, cari mengikut nama & kod kelas semasa
    const clean = (studentName || '').trim().toUpperCase();
    const snap = await get(ref(db, 'students'));
    if (!snap.exists()) return null;

    let progress: any = null;
    const activeCode = (localStorage.getItem('bunyiKataKodKelas') || localStorage.getItem('bunyiKataKodKeluarga') || '').trim().toUpperCase();

    snap.forEach(c => {
      const sData = c.val();
      const matchName = sData?.nama?.trim().toUpperCase() === clean;
      if (matchName && !progress) {
        const matchCode = !activeCode || (sData.kod_kelas && sData.kod_kelas.toUpperCase() === activeCode) || (sData.kod_keluarga && sData.kod_keluarga.toUpperCase() === activeCode);
        if (matchCode) {
          progress = {
            id: c.key,
            nama: sData.nama,
            totalBintang: sData.total_bintang || 0,
            badges: sData.badges || [],
            scores: sData.scores || {},
            stars: sData.stars || {},
            latihan: sData.latihan || {},
            kelasId: sData.kelas_id,
            keluargaId: sData.keluarga_id,
            kodKelas: sData.kod_kelas,
            kodKeluarga: sData.kod_keluarga,
          };
        }
      }
    });
    return progress;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat fetchStudentProgressFromFirebase:', err);
    return null;
  }
}

/**
 * Memadam rekod murid daripada Realtime Database
 */
export async function deleteStudentFromFirebase(studentId: string): Promise<boolean> {
  try {
    if (!studentId) return false;
    await remove(ref(db, `students/${studentId}`));
    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat deleteStudentFromFirebase:', err);
    return false;
  }
}

/**
 * Mendapatkan maklum balas pengguna dari Realtime Database
 */
export async function getFeedbacksFromFirebase(): Promise<any[]> {
  try {
    const snap = await get(ref(db, 'feedbacks'));
    return snapToArray(snap);
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getFeedbacksFromFirebase:', err);
    return [];
  }
}

/**
 * Menghantar maklum balas pengguna
 */
export async function submitUserFeedback(feedback: {
  nama: string;
  email?: string;
  peranan?: string;
  kategori?: string;
  mesej: string;
  penilaian?: number;
}): Promise<boolean> {
  try {
    const newRef = push(ref(db, 'feedbacks'));
    await set(newRef, {
      ...feedback,
      dicipta_pada: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat submitUserFeedback:', err);
    return false;
  }
}

/**
 * Memadam maklum balas di Realtime Database
 */
export async function deleteFeedbackInFirebase(id: string): Promise<boolean> {
  try {
    await remove(ref(db, `feedbacks/${id}`));
    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat deleteFeedbackInFirebase:', err);
    return false;
  }
}

/**
 * Senarai guru berdaftar dari Realtime Database
 */
export async function getRegisteredTeachers(): Promise<any[]> {
  try {
    const q = query(ref(db, 'profiles'), orderByChild('peranan'), equalTo('guru'));
    const snap = await get(q);
    return snapToArray(snap);
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getRegisteredTeachers:', err);
    return [];
  }
}

/**
 * Senarai ibu bapa berdaftar dari Realtime Database
 */
export async function getRegisteredParents(): Promise<any[]> {
  try {
    const q = query(ref(db, 'profiles'), orderByChild('peranan'), equalTo('ibubapa'));
    const snap = await get(q);
    return snapToArray(snap);
  } catch (err) {
    console.error('[Firebase RTDB] Ralat getRegisteredParents:', err);
    return [];
  }
}

/**
 * Memuat turun data Admin dari Realtime Database untuk dipaparkan di Dashboard Admin
 */
export async function fetchAdminDataFromFirebase(): Promise<{ teachers: any[]; parents: any[] }> {
  try {
    const [profilesSnap, classesSnap, familiesSnap, studentsSnap, feedbacksSnap] = await Promise.all([
      get(ref(db, 'profiles')),
      get(ref(db, 'classes')),
      get(ref(db, 'families')),
      get(ref(db, 'students')),
      get(ref(db, 'feedbacks')),
    ]);

    const allProfiles = snapToArray(profilesSnap);
    const teachers = allProfiles.filter((p: any) => p.peranan === 'guru');
    const parents = allProfiles.filter((p: any) => p.peranan === 'ibubapa');
    const classesList = snapToArray(classesSnap);
    const familiesList = snapToArray(familiesSnap);
    const studentsList = snapToArray(studentsSnap);
    const feedbacksList = snapToArray(feedbacksSnap);

    const formattedTeachers = teachers.map((t: any) => {
      let bakiHari = 30;
      if (t.tarikh_tamat) {
        const diff = Math.ceil((new Date(t.tarikh_tamat).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        bakiHari = Math.max(0, diff);
      }

      const teacherClasses = classesList.filter((c: any) => 
        (c.guru_id && c.guru_id === t.id) || 
        (c.nama_guru && t.nama && c.nama_guru.trim().toLowerCase() === t.nama.trim().toLowerCase())
      );
      const teacherClass = teacherClasses[0];
      const allClassCodes = teacherClasses.map((c: any) => c.kod_kelas).filter(Boolean).join(', ');
      const allClassNames = teacherClasses.map((c: any) => c.nama_kelas).filter(Boolean).join(', ');

      const studentCount = teacherClasses.length > 0 
        ? studentsList.filter((s: any) => teacherClasses.some((tc: any) => tc.id === s.kelas_id)).length 
        : 0;

      return {
        id: t.id,
        nama: t.nama || 'Guru',
        sekolah: teacherClass?.nama_sekolah || t.nama_sekolah || '-',
        nama_kelas: allClassNames || teacherClass?.nama_kelas || '',
        kod_kelas: allClassCodes || teacherClass?.kod_kelas || '',
        murid: studentCount,
        bakiHari,
        langganan: t.langganan || '1 Bulan',
        email: t.email || '',
        no_telefon: t.no_telefon || '',
        dicipta_pada: t.dicipta_pada || ''
      };
    });

    const formattedParents = parents.map((p: any) => {
      let bakiHari = 30;
      if (p.tarikh_tamat) {
        const diff = Math.ceil((new Date(p.tarikh_tamat).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        bakiHari = Math.max(0, diff);
      }

      const parentFamily = familiesList.find((f: any) => 
        (f.parent_id && f.parent_id === p.id) || 
        (f.nama_ibubapa && p.nama && f.nama_ibubapa.trim().toLowerCase() === p.nama.trim().toLowerCase())
      );

      const childCount = parentFamily 
        ? studentsList.filter((s: any) => s.keluarga_id === parentFamily.id).length 
        : 0;

      return {
        id: p.id,
        nama: p.nama || 'Ibu Bapa',
        nama_keluarga: parentFamily?.nama_keluarga || '',
        kod_keluarga: parentFamily?.kod_keluarga || '',
        anak: childCount,
        bakiHari,
        langganan: p.langganan || '1 Bulan',
        email: p.email || '',
        no_telefon: parentFamily?.no_telefon || p.no_telefon || '',
        dicipta_pada: p.dicipta_pada || ''
      };
    });

    localStorage.setItem('bunyiKataAdminTeachers', JSON.stringify(formattedTeachers));
    localStorage.setItem('bunyiKataAdminParents', JSON.stringify(formattedParents));

    if (document.getElementById('admin-jumlah-murid')) {
      const totalTeacherStudents = formattedTeachers.reduce((sum, t) => sum + (Number(t.murid) || 0), 0);
      document.getElementById('admin-jumlah-murid')!.innerText = String(totalTeacherStudents);
    }
    if (document.getElementById('admin-jumlah-guru')) {
      document.getElementById('admin-jumlah-guru')!.innerText = String(formattedTeachers.length);
    }
    if (document.getElementById('admin-jumlah-ibubapa')) {
      document.getElementById('admin-jumlah-ibubapa')!.innerText = String(formattedParents.length);
    }
    if (document.getElementById('admin-jumlah-anak')) {
      const totalAnakCount = formattedParents.reduce((sum, p) => sum + (Number(p.anak) || 0), 0);
      document.getElementById('admin-jumlah-anak')!.innerText = String(totalAnakCount);
    }
    if (document.getElementById('admin-jumlah-feedback')) {
      document.getElementById('admin-jumlah-feedback')!.innerText = String(feedbacksList.length);
    }

    if (typeof (window as any).renderTeacherTable === 'function') {
      try { (window as any).renderTeacherTable(); } catch (e) {}
    }
    if (typeof (window as any).renderAdminTable === 'function') {
      try { (window as any).renderAdminTable(); } catch (e) {}
    }
    if (typeof (window as any).renderAdminUrus === 'function') {
      try { (window as any).renderAdminUrus(); } catch (e) {}
    }

    return { teachers: formattedTeachers, parents: formattedParents };
  } catch (err) {
    console.error('[Firebase RTDB] Ralat membaca data admin dari Realtime Database:', err);
    return { teachers: [], parents: [] };
  }
}

/**
 * Menambah hari langganan profil pengguna (+30 hari dsb)
 */
export async function updateProfileSubscription(profileId: string, daysToAdd: number = 30): Promise<boolean> {
  try {
    let targetKey = profileId;
    let pSnap = await get(ref(db, `profiles/${targetKey}`));

    if (!pSnap.exists()) {
      const q = query(ref(db, 'profiles'), orderByChild('email'), equalTo(profileId.trim().toLowerCase()));
      const snap = await get(q);
      if (snap.exists()) {
        snap.forEach(c => {
          targetKey = c.key!;
          pSnap = c;
        });
      } else {
        return false;
      }
    }

    const data = pSnap.val() || {};
    let currentExpiry = data.tarikh_tamat ? new Date(data.tarikh_tamat) : new Date();
    if (currentExpiry.getTime() < Date.now()) currentExpiry = new Date();

    const newExpiry = new Date(currentExpiry.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
    await update(ref(db, `profiles/${targetKey}`), {
      tarikh_tamat: newExpiry,
      dikemaskini_pada: new Date().toISOString(),
    });

    // Kemaskini juga cache tempatan
    try {
      const teachers = JSON.parse(localStorage.getItem('bunyiKataAdminTeachers') || '[]');
      const tIdx = teachers.findIndex((t: any) => t.id === profileId || (t.email && t.email.toLowerCase() === profileId.toLowerCase()));
      if (tIdx > -1) {
        teachers[tIdx].bakiHari = Math.max(0, (teachers[tIdx].bakiHari || 0) + daysToAdd);
        localStorage.setItem('bunyiKataAdminTeachers', JSON.stringify(teachers));
      }
      const parents = JSON.parse(localStorage.getItem('bunyiKataAdminParents') || '[]');
      const pIdx = parents.findIndex((p: any) => p.id === profileId || (p.email && p.email.toLowerCase() === profileId.toLowerCase()));
      if (pIdx > -1) {
        parents[pIdx].bakiHari = Math.max(0, (parents[pIdx].bakiHari || 0) + daysToAdd);
        localStorage.setItem('bunyiKataAdminParents', JSON.stringify(parents));
      }
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat updateProfileSubscription:', err);
    return false;
  }
}

/**
 * Menukar jenis pelan langganan pengguna di Realtime Database
 */
export async function updateProfileSubscriptionPlan(profileId: string, newPlan: string): Promise<boolean> {
  try {
    let targetKey = profileId;
    let pSnap = await get(ref(db, `profiles/${targetKey}`));

    if (!pSnap.exists()) {
      const q = query(ref(db, 'profiles'), orderByChild('email'), equalTo(profileId.trim().toLowerCase()));
      const snap = await get(q);
      if (snap.exists()) {
        snap.forEach(c => {
          targetKey = c.key!;
          pSnap = c;
        });
      } else {
        console.warn('[Firebase RTDB] Profil tidak dijumpai untuk updateProfileSubscriptionPlan:', profileId);
        return false;
      }
    }

    const isPercuma = newPlan.toLowerCase().includes('percuma');
    let daysToAdd = 30;
    if (newPlan.toLowerCase().includes('tahun')) {
      daysToAdd = 365;
    } else if (newPlan.toLowerCase().includes('3 bulan')) {
      daysToAdd = 90;
    }
    const newExpiry = isPercuma ? null : new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    await update(ref(db, `profiles/${targetKey}`), {
      langganan: newPlan,
      tarikh_tamat: newExpiry,
      dikemaskini_pada: new Date().toISOString(),
    });

    try {
      const teachers = JSON.parse(localStorage.getItem('bunyiKataAdminTeachers') || '[]');
      const tIdx = teachers.findIndex((t: any) => t.id === profileId || (t.email && t.email.toLowerCase() === profileId.toLowerCase()));
      if (tIdx > -1) {
        teachers[tIdx].langganan = newPlan;
        teachers[tIdx].bakiHari = isPercuma ? 0 : daysToAdd;
        localStorage.setItem('bunyiKataAdminTeachers', JSON.stringify(teachers));
      }
      const parents = JSON.parse(localStorage.getItem('bunyiKataAdminParents') || '[]');
      const pIdx = parents.findIndex((p: any) => p.id === profileId || (p.email && p.email.toLowerCase() === profileId.toLowerCase()));
      if (pIdx > -1) {
        parents[pIdx].langganan = newPlan;
        parents[pIdx].bakiHari = isPercuma ? 0 : daysToAdd;
        localStorage.setItem('bunyiKataAdminParents', JSON.stringify(parents));
      }
    } catch (e) {}

    const activeUserId = localStorage.getItem('bunyiKataUserId');
    const activeEmail = (localStorage.getItem('bunyiKataGuruEmail') || localStorage.getItem('bunyiKataIbubapaEmail') || '').toLowerCase();
    const isCurrentUser = activeUserId === profileId || (activeEmail && activeEmail === profileId.toLowerCase());
    if (isCurrentUser) {
      const accessLevel = isPercuma ? 'trial' : 'pro';
      localStorage.setItem('bunyiKataAccessLevel', accessLevel);
      localStorage.setItem('bunyiKataTeacherPlan', newPlan);
    }

    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat updateProfileSubscriptionPlan:', err);
    return false;
  }
}

/**
 * Memadam profil pengguna di Realtime Database secara berangkai (cascade delete profil, kelas, keluarga & murid)
 */
export async function deleteProfileInFirebase(profileId: string): Promise<boolean> {
  try {
    let realId = profileId;
    let email = '';
    let pSnap = await get(ref(db, `profiles/${profileId}`));

    if (pSnap.exists()) {
      email = pSnap.val()?.email || '';
    } else {
      const q = query(ref(db, 'profiles'), orderByChild('email'), equalTo(profileId.trim().toLowerCase()));
      const snap = await get(q);
      if (snap.exists()) {
        snap.forEach(c => {
          realId = c.key!;
          email = c.val()?.email || '';
        });
      }
    }

    // 1. Padam dokumen profil
    await remove(ref(db, `profiles/${realId}`));

    // 2. Kumpulkan & padam semua kelas berkaitan
    const classIdentifiers = new Set<string>();
    try {
      const qClass = query(ref(db, 'classes'), orderByChild('guru_id'), equalTo(realId));
      const snapClasses = await get(qClass);
      if (snapClasses.exists()) {
        for (const [key, cVal] of Object.entries(snapClasses.val() as Record<string, any>)) {
          classIdentifiers.add(key);
          if (cVal?.kod_kelas) {
            classIdentifiers.add(cVal.kod_kelas.toString().trim());
            classIdentifiers.add(cVal.kod_kelas.toString().trim().toUpperCase());
          }
          await remove(ref(db, `classes/${key}`));
        }
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Gagal padam kelas berkaitan:', e);
    }

    // 3. Kumpulkan & padam semua keluarga berkaitan
    const familyIdentifiers = new Set<string>();
    try {
      const qFam = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(realId));
      const snapFam = await get(qFam);
      if (snapFam.exists()) {
        for (const [key, fVal] of Object.entries(snapFam.val() as Record<string, any>)) {
          familyIdentifiers.add(key);
          if (fVal?.kod_keluarga) {
            familyIdentifiers.add(fVal.kod_keluarga.toString().trim());
            familyIdentifiers.add(fVal.kod_keluarga.toString().trim().toUpperCase());
          }
          await remove(ref(db, `families/${key}`));
        }
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Gagal padam keluarga berkaitan:', e);
    }

    // 4. Padam semua murid berkaitan
    try {
      const snapStudents = await get(ref(db, 'students'));
      if (snapStudents.exists()) {
        for (const [key, sVal] of Object.entries(snapStudents.val() as Record<string, any>)) {
          const sKelasId = (sVal?.kelas_id || '').toString().trim();
          const sKodKelas = (sVal?.kod_kelas || '').toString().trim();
          const sKeluargaId = (sVal?.keluarga_id || '').toString().trim();
          const sGuruId = sVal?.guru_id || '';
          const sParentId = sVal?.parent_id || '';

          const matchTeacher = sGuruId === realId || sGuruId === profileId;
          const matchClass = (sKelasId && (classIdentifiers.has(sKelasId) || classIdentifiers.has(sKelasId.toUpperCase()))) ||
                             (sKodKelas && (classIdentifiers.has(sKodKelas) || classIdentifiers.has(sKodKelas.toUpperCase())));
          const matchParent = sParentId === realId || sParentId === profileId;
          const matchFamily = (sKeluargaId && (familyIdentifiers.has(sKeluargaId) || familyIdentifiers.has(sKeluargaId.toUpperCase())));

          if (matchTeacher || matchClass || matchParent || matchFamily) {
            await remove(ref(db, `students/${key}`));
          }
        }
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Gagal padam murid berkaitan secara berangkai:', e);
    }

    await cleanupOrphanedStudentsInFirebase();
    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat deleteProfileInFirebase:', err);
    return false;
  }
}

/**
 * Pembersihan automatik bagi rekod murid yang tiada pemilik (orphaned / dummy)
 */
export async function cleanupOrphanedStudentsInFirebase(): Promise<number> {
  try {
    const [classesSnap, famSnap, profSnap, studentsSnap] = await Promise.all([
      get(ref(db, 'classes')),
      get(ref(db, 'families')),
      get(ref(db, 'profiles')),
      get(ref(db, 'students')),
    ]);

    const validClassCodes = new Set<string>();
    if (classesSnap.exists()) {
      classesSnap.forEach(d => {
        validClassCodes.add(d.key!);
        const k = d.val()?.kod_kelas;
        if (k) validClassCodes.add(k.toString().trim().toUpperCase());
      });
    }

    const validFamilyCodes = new Set<string>();
    if (famSnap.exists()) {
      famSnap.forEach(d => {
        validFamilyCodes.add(d.key!);
        const k = d.val()?.kod_keluarga;
        if (k) validFamilyCodes.add(k.toString().trim().toUpperCase());
      });
    }

    const validUserIds = new Set<string>();
    if (profSnap.exists()) {
      profSnap.forEach(d => {
        validUserIds.add(d.key!);
      });
    }

    let deletedCount = 0;
    if (studentsSnap.exists()) {
      const studentsObj = studentsSnap.val() as Record<string, any>;
      for (const [key, data] of Object.entries(studentsObj)) {
        const kid = (data?.kelas_id || data?.kod_kelas || '').toString().trim().toUpperCase();
        const fid = (data?.keluarga_id || data?.kod_keluarga || '').toString().trim().toUpperCase();
        const gid = data?.guru_id || '';
        const pid = data?.parent_id || '';

        const isDummy = kid === 'KELAS#99' || kid === 'KELAS#01' || data?.nama === 'MUHAMMAD ALI BIN YAKOB' || data?.nama === 'AMINAH BINTI ATAN';
        const hasNoValidClass = kid && !validClassCodes.has(kid) && (!gid || !validUserIds.has(gid));
        const hasNoValidFamily = fid && !validFamilyCodes.has(fid) && (!pid || !validUserIds.has(pid));
        const isCompletelyOrphaned = !kid && !fid && !gid && !pid;

        if (isDummy || isCompletelyOrphaned || (kid && hasNoValidClass && !fid) || (fid && hasNoValidFamily && !kid)) {
          await remove(ref(db, `students/${key}`));
          deletedCount++;
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`[Firebase RTDB] Berjaya membersihkan ${deletedCount} rekod murid tanpa pemilik.`);
    }
    return deletedCount;
  } catch (e) {
    console.warn('[Firebase RTDB] Ralat semasa cleanupOrphanedStudentsInFirebase:', e);
    return 0;
  }
}

/**
 * Semak had kelas mengikut pakej langganan
 */
export async function checkSubscriptionCodeLimit(guruIdOrEmail: string, isEditingExisting: boolean = true): Promise<{
  canCreate: boolean;
  message?: string;
  limit: number;
  currentCount: number;
  plan: string;
}> {
  try {
    let guruId = guruIdOrEmail;
    let plan = '1 Bulan (Pro)';

    if (guruIdOrEmail.includes('@')) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(guruIdOrEmail.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => {
          guruId = c.key!;
          plan = c.val()?.langganan || '1 Bulan';
        });
      }
    } else {
      const d = await get(ref(db, `profiles/${guruIdOrEmail}`));
      if (d.exists()) plan = d.val()?.langganan || '1 Bulan';
    }

    const classes = await getTeacherClasses(guruId);
    const count = classes.length;
    const isPercuma = plan.toLowerCase().includes('percuma');
    const limitNum = isPercuma ? 0 : 2;

    if (isEditingExisting) {
      return { canCreate: true, limit: limitNum, currentCount: count, plan };
    }

    if (count >= limitNum) {
      return {
        canCreate: false,
        message: `Had ${limitNum} kelas dicapai bagi pelan ${plan}.`,
        limit: limitNum,
        currentCount: count,
        plan,
      };
    }

    return { canCreate: true, limit: limitNum, currentCount: count, plan };
  } catch (err) {
    return { canCreate: true, limit: 2, currentCount: 0, plan: '1 Bulan (Pro)' };
  }
}

/**
 * Admin cipta profil pengguna secara manual di Realtime Database
 */
export async function adminCreateProfile(userData: {
  nama: string;
  email: string;
  peranan: 'guru' | 'ibubapa' | 'admin';
  nama_sekolah?: string;
  nama_kelas?: string;
  kod_kelas?: string;
  nama_keluarga?: string;
  kod_keluarga?: string;
  no_telefon?: string;
  langganan?: string;
}): Promise<boolean> {
  try {
    const cleanEmail = userData.email.trim().toLowerCase();
    const newProfRef = push(ref(db, 'profiles'));
    await set(newProfRef, {
      id: newProfRef.key!,
      nama: userData.nama.trim(),
      email: cleanEmail,
      peranan: userData.peranan,
      nama_sekolah: userData.nama_sekolah || '',
      no_telefon: userData.no_telefon || '',
      langganan: userData.langganan || '1 Bulan (Pro)',
      tarikh_tamat: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      dicipta_pada: new Date().toISOString(),
    });

    if (userData.peranan === 'guru' && (userData.kod_kelas || userData.nama_kelas)) {
      const newClassRef = push(ref(db, 'classes'));
      await set(newClassRef, {
        guru_id: newProfRef.key!,
        nama_kelas: userData.nama_kelas || 'Kelas 1',
        kod_kelas: (userData.kod_kelas || generateUniqueCode('GURU')).toUpperCase(),
        nama_sekolah: userData.nama_sekolah || 'SK TAMAN MELAWIS',
        nama_guru: userData.nama,
        aktif: true,
        dicipta_pada: new Date().toISOString(),
      });
    }

    if (userData.peranan === 'ibubapa' && (userData.kod_keluarga || userData.nama_keluarga)) {
      const newFamRef = push(ref(db, 'families'));
      await set(newFamRef, {
        parent_id: newProfRef.key!,
        nama_keluarga: userData.nama_keluarga || 'Keluarga Bahagia',
        kod_keluarga: (userData.kod_keluarga || generateUniqueCode('FAM')).toUpperCase(),
        nama_ibubapa: userData.nama,
        no_telefon: userData.no_telefon || '',
        aktif: true,
        dicipta_pada: new Date().toISOString(),
      });
    }

    return true;
  } catch (err) {
    console.error('[Firebase RTDB] Ralat adminCreateProfile:', err);
    return false;
  }
}

/**
 * Inisialisasi Firebase Realtime Listener
 */
export function initFirebaseRealtimeSubscriptions() {
  try {
    onValue(ref(db, 'profiles'), () => {
      console.log('[Firebase RTDB] Profiles dikemas kini.');
      if (typeof (window as any).fetchAdminDataFromFirebase === 'function') {
        (window as any).fetchAdminDataFromFirebase();
      }
    });
  } catch (e) {
    console.warn('[Firebase RTDB notice]:', e);
  }
}

/**
 * Mengemas kini Nama Sekolah dan Nama Guru dalam profiles dan semua kelas berkaitan di Realtime Database
 */
export async function updateTeacherSchoolAndNameInFirebase(params: {
  namaSekolah: string;
  namaGuru: string;
  guruIdOrEmail?: string;
}): Promise<boolean> {
  try {
    const cleanSekolah = params.namaSekolah.trim().toUpperCase();
    const cleanGuru = params.namaGuru.trim().toUpperCase();
    const now = new Date().toISOString();
    const userId = params.guruIdOrEmail || localStorage.getItem('bunyiKataUserId') || localStorage.getItem('bunyiKataGuruEmail') || '';

    if (userId) {
      if (userId.includes('@')) {
        const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(userId.trim().toLowerCase()));
        const snapUser = await get(qUser);
        if (snapUser.exists()) {
          const updates: Promise<void>[] = [];
          snapUser.forEach((c) => {
            updates.push(update(ref(db, `profiles/${c.key}`), {
              nama: cleanGuru,
              nama_sekolah: cleanSekolah,
              dikemaskini_pada: now,
            }));
          });
          await Promise.all(updates);
        }
      } else {
        const pSnap = await get(ref(db, `profiles/${userId}`));
        if (pSnap.exists()) {
          await update(ref(db, `profiles/${userId}`), {
            nama: cleanGuru,
            nama_sekolah: cleanSekolah,
            dikemaskini_pada: now,
          });
        }
      }
    }

    const teacherClasses = await getTeacherClasses(userId);
    for (const c of teacherClasses) {
      if (c.id) {
        await update(ref(db, `classes/${c.id}`), {
          nama_sekolah: cleanSekolah,
          nama_guru: cleanGuru,
          dikemaskini_pada: now,
        });
      }
    }

    return true;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat updateTeacherSchoolAndNameInFirebase:', err);
    return false;
  }
}

/**
 * Mengemas kini Nama Keluarga dalam profiles dan koleksi families di Realtime Database
 */
export async function updateParentFamilyAndNameInFirebase(params: {
  namaKeluarga: string;
  parentIdOrEmail?: string;
  kodKeluarga?: string;
}): Promise<boolean> {
  try {
    const cleanKeluarga = params.namaKeluarga.trim().toUpperCase();
    const now = new Date().toISOString();
    const userId = params.parentIdOrEmail || localStorage.getItem('bunyiKataUserId') || localStorage.getItem('bunyiKataIbubapaEmail') || '';

    let resolvedParentUid = '';
    if (userId) {
      if (userId.includes('@')) {
        const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(userId.trim().toLowerCase()));
        const snapUser = await get(qUser);
        if (snapUser.exists()) {
          snapUser.forEach(c => {
            resolvedParentUid = c.key!;
          });
          if (resolvedParentUid) {
            await update(ref(db, `profiles/${resolvedParentUid}`), {
              nama_keluarga: cleanKeluarga,
              nama: cleanKeluarga,
              dikemaskini_pada: now,
            });
          }
        }
      } else {
        resolvedParentUid = userId;
        const pSnap = await get(ref(db, `profiles/${userId}`));
        if (pSnap.exists()) {
          await update(ref(db, `profiles/${userId}`), {
            nama_keluarga: cleanKeluarga,
            nama: cleanKeluarga,
            dikemaskini_pada: now,
          });
        } else {
          await set(ref(db, `profiles/${userId}`), {
            id: userId,
            nama_keluarga: cleanKeluarga,
            nama: cleanKeluarga,
            peranan: 'ibubapa',
            langganan: 'Percuma',
            tarikh_tamat: null,
            dicipta_pada: now,
            dikemaskini_pada: now,
          });
        }
      }
    }

    const activeParentId = resolvedParentUid || userId;
    let existingFamilyId: string | null = null;
    if (activeParentId) {
      const qFam = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(activeParentId));
      const snapFam = await get(qFam);
      if (snapFam.exists()) {
        snapFam.forEach(c => {
          existingFamilyId = c.key!;
        });
      }
    }

    const payloadFam = {
      nama_keluarga: cleanKeluarga,
      parent_id: activeParentId || null,
      kod_keluarga: params.kodKeluarga || localStorage.getItem('bunyiKataKodKeluarga') || '',
      aktif: true,
      dikemaskini_pada: now,
    };

    if (existingFamilyId) {
      await update(ref(db, `families/${existingFamilyId}`), payloadFam);
    } else {
      const newFamRef = push(ref(db, 'families'));
      await set(newFamRef, {
        ...payloadFam,
        dicipta_pada: now,
      });
    }

    return true;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat updateParentFamilyAndNameInFirebase:', err);
    return false;
  }
}

/**
 * Menyimpan profil anak ke Realtime Database
 */
export async function saveParentChildToFirebase(params: {
  namaAnak: string;
  parentIdOrEmail?: string;
  avatarUrl?: string;
  kodKeluarga?: string;
}): Promise<StudentRecord | null> {
  try {
    const cleanName = params.namaAnak.trim().toUpperCase();
    if (!cleanName) return null;

    const now = new Date().toISOString();
    let parentId = params.parentIdOrEmail || localStorage.getItem('bunyiKataUserId') || '';
    const parentEmail = localStorage.getItem('bunyiKataIbubapaEmail') || '';

    if (parentId && parentId.includes('@')) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(parentId.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => {
          parentId = c.key!;
        });
      }
    }

    let existingStudentId: string | null = null;
    if (parentId) {
      const qCheck = query(ref(db, 'students'), orderByChild('keluarga_id'), equalTo(parentId));
      const snapCheck = await get(qCheck);
      if (snapCheck.exists()) {
        snapCheck.forEach(c => {
          if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
            existingStudentId = c.key!;
          }
        });
      }
    }

    if (!existingStudentId && parentEmail) {
      const qCheckMail = query(ref(db, 'students'), orderByChild('parent_email'), equalTo(parentEmail.toLowerCase()));
      const snapMail = await get(qCheckMail);
      if (snapMail.exists()) {
        snapMail.forEach(c => {
          if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
            existingStudentId = c.key!;
          }
        });
      }
    }

    const payload = {
      nama: cleanName,
      keluarga_id: parentId || null,
      parent_id: parentId || null,
      parent_email: parentEmail ? parentEmail.toLowerCase() : null,
      avatar_url: params.avatarUrl || '/images/avatar/avatar1.png',
      dikemaskini_pada: now,
    };

    let result: StudentRecord;
    if (existingStudentId) {
      await update(ref(db, `students/${existingStudentId}`), payload);
      result = { id: existingStudentId, total_bintang: 0, dicipta_pada: now, ...payload } as StudentRecord;
    } else {
      const newRef = push(ref(db, 'students'));
      await set(newRef, {
        ...payload,
        total_bintang: 0,
        dicipta_pada: now,
      });
      result = { id: newRef.key!, total_bintang: 0, dicipta_pada: now, ...payload } as StudentRecord;
    }

    // Simpan juga senarai nama anak dalam profil ibu bapa
    if (parentId) {
      try {
        const pSnap = await get(ref(db, `profiles/${parentId}`));
        if (pSnap.exists()) {
          const currentAnakList = pSnap.val()?.anak || [];
          if (!currentAnakList.includes(cleanName)) {
            await update(ref(db, `profiles/${parentId}`), {
              anak: [...currentAnakList, cleanName],
              dikemaskini_pada: now,
            });
          }
        }
      } catch (e) {}
    }

    return result;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat saveParentChildToFirebase:', err);
    return null;
  }
}

/**
 * Memadam profil anak ibu bapa daripada Realtime Database
 */
export async function deleteParentChildFromFirebase(params: {
  namaAnak: string;
  parentIdOrEmail?: string;
}): Promise<boolean> {
  try {
    const cleanName = params.namaAnak.trim().toUpperCase();
    if (!cleanName) return false;

    let parentId = params.parentIdOrEmail || localStorage.getItem('bunyiKataUserId') || '';
    const parentEmail = localStorage.getItem('bunyiKataIbubapaEmail') || '';

    if (parentId && parentId.includes('@')) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(parentId.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => {
          parentId = c.key!;
        });
      }
    }

    // 1. Padam daripada students
    if (parentId) {
      const qStu = query(ref(db, 'students'), orderByChild('keluarga_id'), equalTo(parentId));
      const snapStu = await get(qStu);
      if (snapStu.exists()) {
        const removals: Promise<void>[] = [];
        snapStu.forEach((c) => {
          if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
            removals.push(remove(ref(db, `students/${c.key}`)));
          }
        });
        await Promise.all(removals);
      }
    } else if (parentEmail) {
      const qStu = query(ref(db, 'students'), orderByChild('parent_email'), equalTo(parentEmail.toLowerCase()));
      const snapStu = await get(qStu);
      if (snapStu.exists()) {
        const removals: Promise<void>[] = [];
        snapStu.forEach((c) => {
          if (c.val()?.nama?.trim().toUpperCase() === cleanName) {
            removals.push(remove(ref(db, `students/${c.key}`)));
          }
        });
        await Promise.all(removals);
      }
    }

    // 2. Padam daripada array 'anak' dalam profiles
    if (parentId) {
      const pSnap = await get(ref(db, `profiles/${parentId}`));
      if (pSnap.exists()) {
        const currentAnak = pSnap.val()?.anak || [];
        const updatedAnak = currentAnak.filter((n: string) => n.trim().toUpperCase() !== cleanName);
        await update(ref(db, `profiles/${parentId}`), {
          anak: updatedAnak,
          dikemaskini_pada: new Date().toISOString(),
        });
      }
    }

    return true;
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat deleteParentChildFromFirebase:', err);
    return false;
  }
}

/**
 * Menyegerakkan semula data keluarga & profil anak daripada Realtime Database ke aplikasi
 */
export async function syncParentSessionFromFirebase(userIdOrEmail?: string): Promise<{
  namaKeluarga: string;
  kodKeluarga: string;
  children: string[];
} | null> {
  try {
    let parentId = userIdOrEmail || localStorage.getItem('bunyiKataUserId') || '';
    const parentEmail = localStorage.getItem('bunyiKataIbubapaEmail') || '';

    if (!parentId && parentEmail) {
      const qUser = query(ref(db, 'profiles'), orderByChild('email'), equalTo(parentEmail.trim().toLowerCase()));
      const snapUser = await get(qUser);
      if (snapUser.exists()) {
        snapUser.forEach(c => {
          parentId = c.key!;
        });
      }
    }

    if (!parentId && !parentEmail) return null;

    let namaKeluarga = localStorage.getItem('bunyiKataNamaKeluarga') || '';
    let kodKeluarga = localStorage.getItem('bunyiKataKodKeluarga') || '';
    let children: string[] = [];

    // 1. Ambil daripada dokumen profiles
    if (parentId) {
      try {
        const pSnap = await get(ref(db, `profiles/${parentId}`));
        if (pSnap.exists()) {
          const pData = pSnap.val();
          if (pData.nama_keluarga) {
            namaKeluarga = pData.nama_keluarga;
            localStorage.setItem('bunyiKataNamaKeluarga', namaKeluarga);
          } else if (pData.nama && !namaKeluarga) {
            namaKeluarga = pData.nama;
            localStorage.setItem('bunyiKataNamaKeluarga', namaKeluarga);
          }
          if (pData.kod_keluarga) {
            kodKeluarga = pData.kod_keluarga;
            localStorage.setItem('bunyiKataKodKeluarga', kodKeluarga);
          }
          if (Array.isArray(pData.anak) && pData.anak.length > 0) {
            children = [...pData.anak];
          }
          if (pData.tarikh_tamat) {
            localStorage.setItem('bunyiKataTarikhTamat', pData.tarikh_tamat);
          }
          if (pData.langganan) {
            localStorage.setItem('bunyiKataParentPlan', pData.langganan);
          }
        }
      } catch (e) {}
    }

    // 2. Ambil daripada koleksi families jika belum ada
    if (parentId) {
      try {
        const qFam = query(ref(db, 'families'), orderByChild('parent_id'), equalTo(parentId));
        const snapFam = await get(qFam);
        if (snapFam.exists()) {
          snapFam.forEach(f => {
            const fData = f.val();
            if (fData.nama_keluarga) {
              namaKeluarga = fData.nama_keluarga;
              localStorage.setItem('bunyiKataNamaKeluarga', namaKeluarga);
            }
            if (fData.kod_keluarga) {
              kodKeluarga = fData.kod_keluarga;
              localStorage.setItem('bunyiKataKodKeluarga', kodKeluarga);
            }
          });
        }
      } catch (e) {}
    }

    // 3. Ambil senarai anak daripada koleksi students
    try {
      const stuSnaps: any[] = [];
      if (parentId) {
        try {
          const s1 = await get(query(ref(db, 'students'), orderByChild('parent_id'), equalTo(parentId)));
          if (s1.exists()) stuSnaps.push(s1);
        } catch (e) {}
        try {
          const s2 = await get(query(ref(db, 'students'), orderByChild('keluarga_id'), equalTo(parentId)));
          if (s2.exists()) stuSnaps.push(s2);
        } catch (e) {}
      }
      if (parentEmail) {
        try {
          const s3 = await get(query(ref(db, 'students'), orderByChild('parent_email'), equalTo(parentEmail.toLowerCase())));
          if (s3.exists()) stuSnaps.push(s3);
        } catch (e) {}
      }

      let rawLocalData: any = {};
      try {
        rawLocalData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
      } catch (e) {}
      const idMap: Record<string, string> = {};

      stuSnaps.forEach(snap => {
        snap.forEach((c: any) => {
          const sVal = c.val();
          const n = sVal?.nama ? sVal.nama.trim().toUpperCase() : '';
          if (n && !GHOST_NAMES.includes(n.toLowerCase())) {
            children.push(n);
            idMap[n] = c.key;
            const prev = rawLocalData[n] || {};
            const remoteTotal = Number(sVal.total_bintang !== undefined ? sVal.total_bintang : (prev.totalBintang || 0));
            rawLocalData[n] = {
              ...prev,
              id: c.key,
              nama: n,
              avatar: sVal.avatar_url || prev.avatar || '/images/avatar/avatar1.png',
              coins: remoteTotal,
              totalBintang: remoteTotal,
              badges: Array.from(new Set([...(sVal.badges || []), ...(prev.badges || [])])),
              scores: remoteTotal === 0 ? (sVal.scores || {}) : { ...(prev.scores || {}), ...(sVal.scores || {}) },
              stars: remoteTotal === 0 ? (sVal.stars || {}) : { ...(prev.stars || {}), ...(sVal.stars || {}) },
              latihan: remoteTotal === 0 ? (sVal.latihan || {}) : { ...(prev.latihan || {}), ...(sVal.latihan || {}) },
            };
          }
        });
      });

      localStorage.setItem('bunyiKataStudentData', JSON.stringify(rawLocalData));
      localStorage.setItem('bunyiKataStudentFirebaseIds', JSON.stringify(idMap));
      if (typeof window !== 'undefined') {
        (window as any).studentData = rawLocalData;
        (window as any).studentFirebaseIds = idMap;
      }
    } catch (e) {}

    // Segerakkan ke DOM dan window & localStorage
    if (namaKeluarga) {
      const el = document.getElementById('ibubapa-nama-keluarga-title');
      if (el) el.innerText = namaKeluarga;
    }
    const GHOST_NAMES = ['tetamu', 'murid', 'guest', 'student'];
    children = children.filter(c => c && !GHOST_NAMES.includes(c.trim().toLowerCase()));
    if (children.length > 0) {
      localStorage.setItem('bunyiKataParentChildNames', JSON.stringify(children));
      if (typeof window !== 'undefined') {
        (window as any).parentChildNames = children;
        if (!localStorage.getItem('ibubapaAnakTerpilih') || !children.includes(localStorage.getItem('ibubapaAnakTerpilih') || '')) {
          localStorage.setItem('ibubapaAnakTerpilih', children[0]);
          (window as any).anakTerpilih = children[0];
        }
        if (typeof (window as any).renderParentDashboard === 'function') {
          (window as any).renderParentDashboard();
        }
      }
    }

    return { namaKeluarga, kodKeluarga, children };
  } catch (err) {
    console.warn('[Firebase RTDB] Ralat syncParentSessionFromFirebase:', err);
    return null;
  }
}
