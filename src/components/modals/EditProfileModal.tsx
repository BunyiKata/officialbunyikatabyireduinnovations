// @ts-nocheck
import React from 'react';
import { updateUserPasswordInFirebase } from '../../services/authService';
import { saveFamilyToFirebase, updateTeacherSchoolAndNameInFirebase, updateParentFamilyAndNameInFirebase } from '../../services/firebaseService';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  editModalMode: string;
  isMandatorySetup: boolean;
  setIsMandatorySetup: React.Dispatch<React.SetStateAction<boolean>>;
  editModalError: string;
  setEditModalError: React.Dispatch<React.SetStateAction<string>>;
  editKodTemp: string;
  setEditKodTemp: React.Dispatch<React.SetStateAction<string>>;
  editKelasTemp: string;
  setEditKelasTemp: React.Dispatch<React.SetStateAction<string>>;
  editSekolahTemp: string;
  setEditSekolahTemp: React.Dispatch<React.SetStateAction<string>>;
  editGuruTemp: string;
  setEditGuruTemp: React.Dispatch<React.SetStateAction<string>>;
  editNamaKeluargaTemp: string;
  setEditNamaKeluargaTemp: React.Dispatch<React.SetStateAction<string>>;
  editAdminNamaSistemTemp: string;
  setEditAdminNamaSistemTemp: React.Dispatch<React.SetStateAction<string>>;
  editAdminNamaTemp: string;
  setEditAdminNamaTemp: React.Dispatch<React.SetStateAction<string>>;
  isChangingPassword: boolean;
  setIsChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  newPasswordInput: string;
  setNewPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showPasswordConfirmModal: boolean;
  setShowPasswordConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  passwordToast: string;
  setPasswordToast: React.Dispatch<React.SetStateAction<string>>;
  editKod2Temp: string;
  setEditKod2Temp: React.Dispatch<React.SetStateAction<string>>;
  editKelas2Temp: string;
  setEditKelas2Temp: React.Dispatch<React.SetStateAction<string>>;
  isChangingCode1: boolean;
  setIsChangingCode1: React.Dispatch<React.SetStateAction<boolean>>;
  newCode1Input: string;
  setNewCode1Input: React.Dispatch<React.SetStateAction<string>>;
  isChangingCode2: boolean;
  setIsChangingCode2: React.Dispatch<React.SetStateAction<boolean>>;
  newCode2Input: string;
  setNewCode2Input: React.Dispatch<React.SetStateAction<string>>;
  teacherCanHaveClass2: boolean;
  isChangingFamilyCode: boolean;
  setIsChangingFamilyCode: React.Dispatch<React.SetStateAction<boolean>>;
  newFamilyCodeInput: string;
  setNewFamilyCodeInput: React.Dispatch<React.SetStateAction<string>>;
  isChangingClassName1: boolean;
  setIsChangingClassName1: React.Dispatch<React.SetStateAction<boolean>>;
  newClassName1Input: string;
  setNewClassName1Input: React.Dispatch<React.SetStateAction<string>>;
  isChangingClassName2: boolean;
  setIsChangingClassName2: React.Dispatch<React.SetStateAction<boolean>>;
  newClassName2Input: string;
  setNewClassName2Input: React.Dispatch<React.SetStateAction<string>>;
  setIsChangingFamilyName: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProPricingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProPricingTab: React.Dispatch<React.SetStateAction<any>>;
  handleSaveClassName1: (name: string) => Promise<void>;
  handleSaveClassCode1: (code: string) => Promise<void>;
  handleSaveClassName2: (name: string) => Promise<void>;
  handleSaveClassCode2: (code: string) => Promise<void>;
  handleSaveFamilyCode: (code: string) => Promise<void>;
  registerCodeInRegistry: (code: string, role: 'guru' | 'ibubapa' | 'admin') => void;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEffectiveTrial?: boolean;
  isEffectivePro?: boolean;
}

export function EditProfileModal(props: EditProfileModalProps) {
  const {
    isOpen,
    onClose,
    editModalMode,
    isMandatorySetup,
    setIsMandatorySetup,
    editModalError,
    setEditModalError,
    editKodTemp,
    setEditKodTemp,
    editKelasTemp,
    setEditKelasTemp,
    editSekolahTemp,
    setEditSekolahTemp,
    editGuruTemp,
    setEditGuruTemp,
    editNamaKeluargaTemp,
    setEditNamaKeluargaTemp,
    editAdminNamaSistemTemp,
    setEditAdminNamaSistemTemp,
    editAdminNamaTemp,
    setEditAdminNamaTemp,
    isChangingPassword,
    setIsChangingPassword,
    newPasswordInput,
    setNewPasswordInput,
    showNewPassword,
    setShowNewPassword,
    showPasswordConfirmModal,
    setShowPasswordConfirmModal,
    passwordToast,
    setPasswordToast,
    editKod2Temp,
    setEditKod2Temp,
    editKelas2Temp,
    setEditKelas2Temp,
    isChangingCode1,
    setIsChangingCode1,
    newCode1Input,
    setNewCode1Input,
    isChangingCode2,
    setIsChangingCode2,
    newCode2Input,
    setNewCode2Input,
    teacherCanHaveClass2,
    isChangingFamilyCode,
    setIsChangingFamilyCode,
    newFamilyCodeInput,
    setNewFamilyCodeInput,
    isChangingClassName1,
    setIsChangingClassName1,
    newClassName1Input,
    setNewClassName1Input,
    isChangingClassName2,
    setIsChangingClassName2,
    newClassName2Input,
    setNewClassName2Input,
    setIsChangingFamilyName,
    setIsProPricingModalOpen,
    setProPricingTab,
    handleSaveClassName1,
    handleSaveClassCode1,
    handleSaveClassName2,
    handleSaveClassCode2,
    handleSaveFamilyCode,
    registerCodeInRegistry,
    setIsEditModalOpen,
  } = props;

  const isGuestModeActive = Boolean(
    typeof window !== "undefined" && ((window as any).isGuestMode || (window as any).userAccessLevel === "trial" || localStorage.getItem("bunyiKataAccessLevel") === "trial" || (window as any).namaMuridAktif === "Tetamu")
  );
  const isPlanFree = typeof window !== "undefined" && (
    localStorage.getItem("bunyiKataTeacherPlan")?.toLowerCase() === "percuma" ||
    localStorage.getItem("bunyiKataParentPlan")?.toLowerCase() === "percuma"
  );
  const isEffectiveTrial = props.isEffectiveTrial !== undefined
    ? props.isEffectiveTrial
    : (isGuestModeActive || (isPlanFree && !(window as any).isUserAdmin?.() && !(window as any).modAdminAktif && !(window as any).isAdminMode));
  const isEffectivePro = props.isEffectivePro !== undefined
    ? props.isEffectivePro
    : !isEffectiveTrial;

  const [affiliateNamaTemp, setAffiliateNamaTemp] = React.useState(() => {
    return typeof localStorage !== "undefined" ? localStorage.getItem("bunyiKataNamaAffiliate") || "" : "";
  });
  const [affiliateKodTemp, setAffiliateKodTemp] = React.useState(() => {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem("bunyiKataAffiliateKod") ||
        localStorage.getItem("affiliateKod") ||
        (window as any).bunyiKataAffiliateKod ||
        (window as any).affiliateKod ||
        ""
      : "";
  });
  const [affiliateEmailTemp, setAffiliateEmailTemp] = React.useState(() => {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem("bunyiKataAffiliateEmail") ||
        localStorage.getItem("bunyiKataUserEmail") ||
        (window as any).bunyiKataAffiliateEmail ||
        ""
      : "";
  });

  React.useEffect(() => {
    if (isOpen && editModalMode === "affiliate") {
      const storedNama = localStorage.getItem("bunyiKataNamaAffiliate") || (window as any).bunyiKataNamaAffiliate || "";
      const storedKod = localStorage.getItem("bunyiKataAffiliateKod") || localStorage.getItem("affiliateKod") || (window as any).bunyiKataAffiliateKod || "";
      const storedEmail = localStorage.getItem("bunyiKataAffiliateEmail") || localStorage.getItem("bunyiKataUserEmail") || (window as any).bunyiKataAffiliateEmail || "";

      if (storedNama) setAffiliateNamaTemp(storedNama);
      if (storedKod) setAffiliateKodTemp(storedKod);
      if (storedEmail) setAffiliateEmailTemp(storedEmail);

      // Pastikan kod dan emel sentiasa dimuatkan daripada profil jika kosong
      if (!storedKod || !storedEmail || !storedNama) {
        import("../../services/adminService").then(({ ambilProfilAffiliate }) => {
          ambilProfilAffiliate().then((res) => {
            if (res?.affiliate) {
              if (res.affiliate.kod) {
                setAffiliateKodTemp(res.affiliate.kod);
                localStorage.setItem("bunyiKataAffiliateKod", res.affiliate.kod);
                (window as any).bunyiKataAffiliateKod = res.affiliate.kod;
              }
              if (res.affiliate.email) {
                setAffiliateEmailTemp(res.affiliate.email);
                localStorage.setItem("bunyiKataAffiliateEmail", res.affiliate.email);
                (window as any).bunyiKataAffiliateEmail = res.affiliate.email;
              }
              if (res.affiliate.nama && !storedNama) {
                setAffiliateNamaTemp(res.affiliate.nama);
                localStorage.setItem("bunyiKataNamaAffiliate", res.affiliate.nama);
                (window as any).bunyiKataNamaAffiliate = res.affiliate.nama;
              }
            }
          }).catch((err) => {
            console.warn("[EditProfileModal] Gagal ambil profil affiliate:", err);
          });
        }).catch(() => {});
      }
    }
  }, [isOpen, editModalMode]);

  const isEditModalOpen = isOpen;

  return (
    <>
      {isEditModalOpen && (() => {
            const isAffiliate = editModalMode === "affiliate";
            const isAdmin = editModalMode === "admin";
            const isParent = editModalMode === "ibubapa";
            const isGuru = editModalMode === "guru";

            const modalHeaderTitle = isAffiliate
              ? "Maklumat Affiliate"
              : isAdmin
                ? "Maklumat Admin"
                : isParent
                  ? "Maklumat Keluarga"
                  : "Maklumat Guru";

            const headerBgColor = isAffiliate
              ? "#7c3aed"
              : isAdmin
                ? "#168f81"
                : isParent
                  ? "var(--color-blue)"
                  : "var(--color-orange)";

            const labelHighlightStyle: React.CSSProperties = {
              backgroundColor: headerBgColor,
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "8px",
              border: "2px solid #10182f",
              fontWeight: "900",
              fontSize: "0.88rem",
              letterSpacing: "0.5px",
              boxShadow: "0 3px 0 #10182f",
              display: "inline-block",
            };

            return (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 10000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    borderRadius: "16px",
                    padding: "24px",
                    position: "relative",
                    width: "90%",
                    maxWidth: "500px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    border: "3px solid var(--color-dark)",
                    boxShadow: "0 4px 0 var(--color-dark)",
                  }}
                >
                  <button
                    className="neo-btn bg-red"
                    onClick={() => {
                      if (isMandatorySetup) {
                        setEditModalError("Sila lengkapkan semua maklumat wajib bertanda (*) dan klik butang simpan.");
                        return;
                      }
                      setIsEditModalOpen(false);
                      setEditModalError("");
                    }}
                    title="Tutup"
                    aria-label="Tutup"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div
                      className="neo-btn"
                      style={{
                        backgroundColor: headerBgColor,
                        color: "white",
                        fontSize: "1.2rem",
                        margin: "0 auto",
                        whiteSpace: "normal",
                        display: "inline-block",
                        textAlign: "center",
                        pointerEvents: "none",
                        padding: "10px 20px",
                      }}
                    >
                      {modalHeaderTitle}
                    </div>
                  </div>

                  {/* Error Banner */}
                  {editModalError && (
                    <div
                      style={{
                        backgroundColor: "#fee2e2",
                        border: "2px solid #ef4444",
                        color: "#b91c1c",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                      <span>{editModalError}</span>
                    </div>
                  )}

                  {/* Success Banner (Kata Laluan) */}
                  {passwordToast && (
                    <div
                      style={{
                        backgroundColor: "#dcfce7",
                        border: "2px solid #22c55e",
                        color: "#15803d",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                      <span>{passwordToast}</span>
                    </div>
                  )}

                  {isAffiliate ? (
                    <>
                      {/* Nama Affiliate */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Affiliate</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="CTH: AMIR"
                            value={affiliateNamaTemp}
                            onChange={(e) => {
                              setAffiliateNamaTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                          <i
                            className="fa-solid fa-user-pen"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#7c3aed",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Kod Affiliate (Read-Only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kod Affiliate</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={affiliateKodTemp || localStorage.getItem("bunyiKataAffiliateKod") || "-"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#1e293b",
                              fontSize: "1rem",
                              fontWeight: "900",
                              letterSpacing: "1px",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-key"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#7c3aed",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Emel Affiliate (Read-Only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Affiliate</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={affiliateEmailTemp || localStorage.getItem("bunyiKataAffiliateEmail") || "-"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#1e293b",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#7c3aed",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Tukar Kata Laluan */}
                      <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                        {!isChangingPassword ? (
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              width: "100%",
                              padding: "10px",
                              backgroundColor: "#f8fafc",
                              color: "#334155",
                              border: "2px dashed #7c3aed",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsChangingPassword(true);
                              setNewPasswordInput("");
                            }}
                          >
                            <i className="fa-solid fa-key" style={{ color: "#7c3aed" }}></i>
                            <span>Tukar Kata Laluan Affiliate</span>
                          </button>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#f5f3ff",
                              border: "2px solid #7c3aed",
                              borderRadius: "8px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "#7c3aed" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#7c3aed",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    (window as any).notify("Sila masukkan kata laluan baharu!");
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : isAdmin ? (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Sistem</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="CTH: BUNYI KATA APP"
                          value={editAdminNamaSistemTemp}
                          onChange={(e) => {
                            setEditAdminNamaSistemTemp(e.target.value.toUpperCase());
                            if (editModalError) setEditModalError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid var(--color-dark)",
                            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Admin</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="CTH: IR EDUINNOVATIONS"
                          value={editAdminNamaTemp}
                          onChange={(e) => {
                            setEditAdminNamaTemp(e.target.value.toUpperCase());
                            if (editModalError) setEditModalError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid var(--color-dark)",
                            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        />
                      </div>

                      {/* NOTA: Medan "Kod Admin" dibuang. Kod admin sebenar
                          dipegang oleh PELAYAN (ADMIN_CODE, /api/admin/verify)
                          dan tidak boleh diubah dari klien. Medan lama ini hanya
                          memaparkan nilai localStorage basi (cth. "ADMIN#02")
                          yang mengelirukan. */}

                      {/* Ruangan Emel Admin (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Admin</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataAdminEmail") || "admin@ireduinnovations.com"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Admin */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Admin</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    (window as any).notify("Sila masukkan kata laluan baharu!");
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : isParent ? (
                    <>
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Keluarga</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="CTH: KELUARGA RAZAK"
                            value={editNamaKeluargaTemp}
                            onChange={(e) => {
                              setEditNamaKeluargaTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                          <i
                            className="fa-solid fa-house-user"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#0284c7",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Notifikasi & Butang Simpan Automatik apabila mengedit Nama Keluarga */}
                      {editNamaKeluargaTemp.trim() !== (localStorage.getItem("bunyiKataNamaKeluarga") || "") && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#f0f9ff",
                            border: "1.5px solid #0284c7",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            marginBottom: "14px",
                            animation: "pulse 1.5s infinite",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#0369a1", display: "flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-circle-info"></i> Perubahan nama keluarga dikesan
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                padding: "5px 10px",
                                fontSize: "0.78rem",
                                borderRadius: "6px",
                              }}
                              onClick={() => {
                                setEditNamaKeluargaTemp(localStorage.getItem("bunyiKataNamaKeluarga") || "");
                              }}
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#0284c7",
                                color: "white",
                                padding: "5px 12px",
                                fontSize: "0.78rem",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                              onClick={async () => {
                                const finalName = editNamaKeluargaTemp.trim().toUpperCase();
                                if (!finalName) {
                                  if ((window as any).showAppToast) {
                                    (window as any).showAppToast("Amaran", "Nama keluarga tidak boleh dibiarkan kosong!", "warning");
                                  }
                                  return;
                                }
                                localStorage.setItem("bunyiKataNamaKeluarga", finalName);
                                setEditNamaKeluargaTemp(finalName);
                                const parentId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
                                const currentKod = localStorage.getItem("bunyiKataKodKeluarga") || "";

                                try {
                                  if (typeof updateParentFamilyAndNameInFirebase === "function") {
                                    await updateParentFamilyAndNameInFirebase({
                                      namaKeluarga: finalName,
                                      parentIdOrEmail: parentId,
                                      kodKeluarga: currentKod,
                                    });
                                  } else if (typeof saveFamilyToFirebase === "function" && currentKod) {
                                    await saveFamilyToFirebase({
                                      kodKeluarga: currentKod,
                                      namaKeluarga: finalName,
                                      parentId: parentId,
                                    });
                                  }
                                } catch (err) {
                                  console.warn("Firebase family update notice:", err);
                                }

                                const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                                if (famTitle) famTitle.textContent = finalName;
                                const famDashTitle = document.getElementById("ibubapa-dashboard-nama-keluarga-title");
                                if (famDashTitle) famDashTitle.textContent = finalName;

                                setIsChangingFamilyName(false);
                                if ((window as any).showAppToast) {
                                  (window as any).showAppToast("Nama Keluarga Dikemas Kini", "Nama keluarga berjaya disimpan ke pangkalan data!");
                                }
                              }}
                            >
                              <i className="fa-solid fa-floppy-disk"></i> Simpan
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bahagian Kod Keluarga */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            className="neo-btn"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "var(--color-blue, #0284c7)",
                              color: "white",
                              padding: "6px 16px",
                              borderRadius: "12px",
                              border: "2.5px solid var(--color-dark, #10182f)",
                              boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                              pointerEvents: "none",
                            }}
                          >
                            <i className="fa-solid fa-people-roof" style={{ fontSize: "0.9rem" }}></i>
                            <span
                              style={{
                                fontWeight: 900,
                                fontSize: "0.92rem",
                                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                              }}
                            >
                              Pengurusan Kod Keluarga
                            </span>
                          </div>
                          <span
                            style={{
                              background: isEffectivePro ? "#dcfce7" : "#fee2e2",
                              color: isEffectivePro ? "#15803d" : "#b91c1c",
                              border: isEffectivePro ? "1.5px solid #22c55e" : "1.5px solid #ef4444",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                              display: "inline-flex",
                              alignItems: "center",
                              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
                            }}
                          >
                            {isEffectiveTrial ? "Percuma" : "Pro"}
                          </span>
                        </div>

                        {isEffectiveTrial ? (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kod Keluarga Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#0284c7",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("ibubapa");
                                } else {
                                  setProPricingTab("ibubapa");
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        ) : (
                        <div style={{ marginBottom: "14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Kod Keluarga</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          {!isChangingFamilyCode ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  flex: 1,
                                  padding: "10px 12px",
                                  borderRadius: "8px",
                                  border: "2px solid #cbd5e1",
                                  backgroundColor: "#f8fafc",
                                  color: editKodTemp ? "#0f172a" : "#94a3b8",
                                  fontSize: "1.05rem",
                                  letterSpacing: "1.5px",
                                  fontWeight: "900",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <i className="fa-solid fa-key" style={{ color: "#0284c7", fontSize: "0.9rem" }}></i>
                                <span>{editKodTemp || "Kod Belum Ditetapkan"}</span>
                              </div>
                              <button
                                type="button"
                                className="neo-btn"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  padding: 0,
                                  minWidth: "38px",
                                  backgroundColor: "#0284c7",
                                  color: "#ffffff",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  setIsChangingFamilyCode(true);
                                  setNewFamilyCodeInput(editKodTemp || "");
                                }}
                                title={editKodTemp ? "Tukar Kod Keluarga" : "Tetapkan Kod Keluarga"}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "#f0f9ff",
                                border: "2px solid #0284c7",
                                borderRadius: "10px",
                                padding: "10px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <input
                                  type="text"
                                  maxLength={8}
                                  placeholder="CTH: FAM@2026"
                                  value={newFamilyCodeInput}
                                  onChange={(e) => setNewFamilyCodeInput(e.target.value.toUpperCase())}
                                  style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "1rem",
                                    fontWeight: "900",
                                    fontFamily: "inherit",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.5px",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="neo-btn bg-red"
                                  style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={() => setIsChangingFamilyCode(false)}
                                  title="Batal"
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                                <button
                                  type="button"
                                  className="neo-btn"
                                  style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={() => handleSaveFamilyCode(newFamilyCodeInput)}
                                  title="Sahkan Kod Keluarga"
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      </div>

                      {/* Ruangan Emel Ibu Bapa (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Ibu Bapa</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataIbubapaEmail") || "ibubapa@gmail.com"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Ibu Bapa */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Ibu Bapa</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    (window as any).notify("Sila masukkan kata laluan baharu!");
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ width: "100%" }}>
                      {/* Nama Sekolah & Nama Guru Side-by-Side */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          marginBottom: "14px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Nama Sekolah</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="CTH: SK BUKIT BERUANG"
                            value={editSekolahTemp}
                            onChange={(e) => {
                              setEditSekolahTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Nama Guru</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="CTH: CIKGU SARAH"
                            value={editGuruTemp}
                            onChange={(e) => {
                              setEditGuruTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                      </div>

                      {/* Notifikasi & Butang Simpan Automatik apabila mengedit Nama Sekolah / Guru */}
                      {(editSekolahTemp.trim() !== (localStorage.getItem("bunyiKataNamaSekolah") || "") ||
                        editGuruTemp.trim() !== (localStorage.getItem("bunyiKataNamaGuru") || "")) && (
                        <div
                          style={{
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#ecfdf5",
                            border: "2px solid #10b981",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            boxShadow: "0 2px 0 var(--color-dark)",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#065f46", display: "flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-pen-nib" style={{ color: "#10b981" }}></i>
                            Simpan perubahan Nama Sekolah & Guru?
                          </span>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              backgroundColor: "#16a34a",
                              color: "white",
                              padding: "6px 14px",
                              fontSize: "0.84rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            onClick={async () => {
                              const s = editSekolahTemp.trim().toUpperCase();
                              const g = editGuruTemp.trim().toUpperCase();
                              if (!s || !g) {
                                (window as any).notify("Sila lengkapkan Nama Sekolah dan Nama Guru!");
                                return;
                              }
                              localStorage.setItem("bunyiKataNamaSekolah", s);
                              localStorage.setItem("pdf_sekolah", s);
                              localStorage.setItem("bunyiKataNamaGuru", g);
                              localStorage.setItem("pdf_guru", g);
                              const sEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                              if (sEl) sEl.innerText = s;
                              const gEl = document.getElementById("guru-dashboard-nama-guru-title");
                              if (gEl) gEl.innerText = g;

                              await updateTeacherSchoolAndNameInFirebase({
                                namaSekolah: s,
                                namaGuru: g,
                              });

                              if (typeof (window as any).showAppToast === "function") {
                                (window as any).showAppToast("Berjaya Disimpan", "Nama sekolah dan nama guru berjaya dikemas kini ke pangkalan data!");
                              }
                            }}
                          >
                            <i className="fa-solid fa-check"></i> Simpan
                          </button>
                        </div>
                      )}

                      {/* Bahagian Kod Kelas (Kelas 1 & Kelas 2) */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            className="neo-btn"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "var(--color-orange, #ea580c)",
                              color: "white",
                              padding: "6px 16px",
                              borderRadius: "12px",
                              border: "2.5px solid var(--color-dark, #10182f)",
                              boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                              pointerEvents: "none",
                            }}
                          >
                            <i className="fa-solid fa-chalkboard-user" style={{ fontSize: "0.9rem" }}></i>
                            <span
                              style={{
                                fontWeight: 900,
                                fontSize: "0.92rem",
                                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                              }}
                            >
                              Pengurusan Kod Kelas
                            </span>
                          </div>
                          <span
                            style={{
                              background: isEffectivePro ? "#dcfce7" : "#fee2e2",
                              color: isEffectivePro ? "#15803d" : "#b91c1c",
                              border: isEffectivePro ? "1.5px solid #22c55e" : "1.5px solid #ef4444",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                              display: "inline-flex",
                              alignItems: "center",
                              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
                            }}
                          >
                            {isEffectiveTrial ? "Percuma" : "Pro"}
                          </span>
                        </div>

                        {/* KAD KELAS 1 (Utama) */}
                        {isEffectiveTrial ? (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kelas Pertama Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#ea580c",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("guru");
                                } else {
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#ffffff",
                              border: "2px solid #ea580c",
                              borderRadius: "12px",
                              padding: "14px",
                              marginBottom: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "900", color: "#c2410c", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-1" style={{ background: "#ea580c", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                                Kelas Pertama
                              </span>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Nama Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                              </label>
                              {!isChangingClassName1 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKelasTemp ? "#0f172a" : "#94a3b8",
                                      fontSize: "0.95rem",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-chalkboard-user" style={{ color: "#ea580c", fontSize: "0.9rem" }}></i>
                                    <span>{editKelasTemp || "Nama Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: headerBgColor,
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingClassName1(true);
                                      setNewClassName1Input(editKelasTemp || "");
                                    }}
                                    title={editKelasTemp ? "Tukar Nama Kelas 1" : "Tetapkan Nama Kelas 1"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#fff7ed",
                                    border: "2px solid #ea580c",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      placeholder="CTH: 1 CEMERLANG"
                                      value={newClassName1Input}
                                      onChange={(e) => setNewClassName1Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "0.95rem",
                                        fontWeight: "900",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingClassName1(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassName1(newClassName1Input)}
                                      title="Sahkan Nama Kelas 1"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Kod Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                              </label>
                              {!isChangingCode1 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: "#0f172a",
                                      fontSize: "1rem",
                                      letterSpacing: "2px",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-key" style={{ color: "#ea580c", fontSize: "0.85rem" }}></i>
                                    <span style={{ color: editKodTemp ? "#0f172a" : "#94a3b8" }}>
                                      {editKodTemp || "Kod Belum Ditetapkan"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: headerBgColor,
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingCode1(true);
                                      setNewCode1Input(editKodTemp || "");
                                    }}
                                    title={editKodTemp ? "Tukar Kod Kelas 1" : "Tetapkan Kod Kelas 1"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#fff7ed",
                                    border: "2px solid #ea580c",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      maxLength={8}
                                      placeholder="CTH: KELAS#01"
                                      value={newCode1Input}
                                      onChange={(e) => setNewCode1Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "1rem",
                                        fontWeight: "900",
                                        letterSpacing: "1.5px",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingCode1(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassCode1(newCode1Input)}
                                      title="Gunakan Kod Ini"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "#ea580c", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                    * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* KAD KELAS 2 (Kelas Kedua) */}
                        {teacherCanHaveClass2 ? (
                          <div
                            style={{
                              backgroundColor: "#ffffff",
                              border: "2px solid #0284c7",
                              borderRadius: "12px",
                              padding: "14px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "900", color: "#0369a1", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-2" style={{ background: "#0284c7", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                                Kelas Kedua
                              </span>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Nama Kelas 2:
                              </label>
                              {!isChangingClassName2 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKelas2Temp ? "#0f172a" : "#94a3b8",
                                      fontSize: "0.95rem",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-chalkboard-user" style={{ color: "#0284c7", fontSize: "0.9rem" }}></i>
                                    <span>{editKelas2Temp || "Nama Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: "#0284c7",
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingClassName2(true);
                                      setNewClassName2Input(editKelas2Temp || "");
                                    }}
                                    title={editKelas2Temp ? "Tukar Nama Kelas 2" : "Tetapkan Nama Kelas 2"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    border: "2px solid #0284c7",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      placeholder="CTH: 1 PINTAR"
                                      value={newClassName2Input}
                                      onChange={(e) => setNewClassName2Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "0.95rem",
                                        fontWeight: "900",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingClassName2(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassName2(newClassName2Input)}
                                      title="Sahkan Nama Kelas 2"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Kod Kelas 2:
                              </label>
                              {!isChangingCode2 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKod2Temp ? "#0f172a" : "#94a3b8",
                                      fontSize: "1rem",
                                      letterSpacing: "2px",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-key" style={{ color: "#0284c7", fontSize: "0.85rem" }}></i>
                                    <span>{editKod2Temp || "Kod Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: "#0284c7",
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingCode2(true);
                                      setNewCode2Input(editKod2Temp || "");
                                    }}
                                    title={editKod2Temp ? "Tukar Kod Kelas 2" : "Tetapkan Kod Kelas 2"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    border: "2px solid #0284c7",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      maxLength={8}
                                      placeholder="CTH: KLS2#01"
                                      value={newCode2Input}
                                      onChange={(e) => setNewCode2Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "1rem",
                                        fontWeight: "900",
                                        letterSpacing: "1.5px",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingCode2(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => {
                                        if (newCode2Input.trim().toUpperCase() === editKodTemp) {
                                          (window as any).notify("Kod Kelas 2 tidak boleh sama dengan Kod Kelas 1!");
                                          return;
                                        }
                                        handleSaveClassCode2(newCode2Input);
                                      }}
                                      title="Gunakan Kod Ini"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                    * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kelas Kedua Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#ea580c",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("guru");
                                } else {
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Ruangan Emel Guru (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Guru</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataGuruEmail") || "guru@moe.edu.my"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Guru */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Guru</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    if ((window as any).showAppToast) {
                                      (window as any).showAppToast("Amaran", "Sila masukkan kata laluan baharu!", "warning");
                                    } else {
                                      (window as any).notify("Sila masukkan kata laluan baharu!");
                                    }
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pop up Pengesahan Tukar Kata Laluan */}
                  {showPasswordConfirmModal && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.65)",
                        zIndex: 100000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                      }}
                    >
                      <div
                        className="neo-box"
                        style={{
                          backgroundColor: "#fef9ec",
                          maxWidth: "360px",
                          width: "92%",
                          padding: "24px 20px",
                          borderRadius: "20px",
                          textAlign: "center",
                          border: "3px solid var(--color-dark)",
                          boxShadow: "0 6px 0 var(--color-dark)",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: headerBgColor,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px auto",
                            fontSize: "1.3rem",
                            border: "2px solid var(--color-dark)",
                            boxShadow: "0 2px 0 var(--color-dark)",
                          }}
                        >
                          <i className="fa-solid fa-key"></i>
                        </div>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>
                          Sahkan Kata Laluan
                        </h4>
                        <p style={{ margin: "0 0 18px 0", fontSize: "0.88rem", color: "#64748b", lineHeight: "1.4" }}>
                          Adakah anda pasti mahu menyimpan kata laluan baharu ini?
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              flex: 1,
                              padding: "9px 12px",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.9rem",
                              justifyContent: "center",
                            }}
                            onClick={() => setShowPasswordConfirmModal(false)}
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              flex: 1,
                              padding: "9px 12px",
                              backgroundColor: headerBgColor,
                              color: "#ffffff",
                              fontSize: "0.9rem",
                              justifyContent: "center",
                            }}
                            onClick={async () => {
                              // [KESELAMATAN S1] JANGAN simpan kata laluan mentah dalam localStorage.
                              // Kata laluan hanya dihantar terus ke Firebase Auth di bawah.
                              const passToSave = newPasswordInput.trim();

                              try {
                                await updateUserPasswordInFirebase(passToSave);
                              } catch (err) {
                                console.warn("Firebase password sync:", err);
                              }

                              setShowPasswordConfirmModal(false);
                              setIsChangingPassword(false);
                              setNewPasswordInput("");
                              if ((window as any).showAppToast) {
                                (window as any).showAppToast("Kata Laluan Dikemaskini", "Kata laluan baharu anda telah berjaya disimpan ke pangkalan data!");
                              } else if (typeof setPasswordToast === "function") {
                                setPasswordToast("Kata laluan baharu berjaya disimpan!");
                              }
                            }}
                          >
                            Ya, Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAffiliate ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          if (!affiliateNamaTemp.trim()) {
                            setEditModalError("Sila masukkan Nama Affiliate!");
                            return;
                          }

                          const namaBersih = affiliateNamaTemp.trim().toUpperCase();
                          localStorage.setItem("bunyiKataNamaAffiliate", namaBersih);
                          const titleEl = document.getElementById("affiliate-nama-title");
                          if (titleEl) titleEl.innerText = namaBersih;

                          try {
                            const { kemaskiniProfilAffiliate } = await import("../../services/adminService");
                            await kemaskiniProfilAffiliate({ nama: namaBersih });
                          } catch (err) {
                            console.warn("Kemaskini profil affiliate server:", err);
                          }

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Affiliate telah berjaya disimpan!
                              </p>`
                            );
                          }
                        }}
                        title="Simpan Maklumat Affiliate"
                        aria-label="Simpan Maklumat Affiliate"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: "#7c3aed",
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Affiliate</span>
                      </button>
                    </div>
                  ) : isAdmin ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editAdminNamaSistemTemp.trim()) {
                            setEditModalError("Sila lengkapkan ruangan Nama Sistem!");
                            return;
                          }
                          if (!editAdminNamaTemp.trim()) {
                            setEditModalError("Sila lengkapkan ruangan Nama Admin!");
                            return;
                          }

                          const namaSistem = editAdminNamaSistemTemp.trim().toUpperCase();
                          const namaAdmin = editAdminNamaTemp.trim().toUpperCase();

                          localStorage.setItem("bunyiKataNamaSistem", namaSistem);
                          localStorage.setItem("bunyiKataNamaAdmin", namaAdmin);
                          // Buang nilai kod admin lama (basi, cth. "ADMIN#02").
                          // Kod admin sebenar dipegang pelayan (ADMIN_CODE).
                          localStorage.removeItem("bunyiKataKodAdmin");

                          const kelasTitle = document.getElementById("admin-dashboard-nama-kelas-title");
                          if (kelasTitle) kelasTitle.innerText = namaSistem;
                          const guruTitle = document.getElementById("admin-dashboard-nama-guru-title");
                          if (guruTitle) guruTitle.innerText = namaAdmin;

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Admin telah berjaya disimpan!
                              </p>`
                            );
                          }
                        }}
                        title="Simpan Maklumat Admin"
                        aria-label="Simpan Maklumat Admin"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Admin</span>
                      </button>
                    </div>
                  ) : isGuru ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          const s = editSekolahTemp.trim().toUpperCase();
                          const g = editGuruTemp.trim().toUpperCase();
                          if (!s || !g) {
                            setEditModalError("Sila lengkapkan Nama Sekolah dan Nama Guru!");
                            return;
                          }

                          localStorage.setItem("bunyiKataNamaSekolah", s);
                              localStorage.setItem("pdf_sekolah", s);
                          localStorage.setItem("bunyiKataNamaGuru", g);
                          localStorage.setItem("pdf_guru", g);
                          const sEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                          if (sEl) sEl.innerText = s;
                          const gEl = document.getElementById("guru-dashboard-nama-guru-title");
                          if (gEl) gEl.innerText = g;

                          try {
                            await updateTeacherSchoolAndNameInFirebase({
                              namaSekolah: s,
                              namaGuru: g,
                            });
                          } catch (err) {
                            console.warn("Firebase teacher update err:", err);
                          }

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Guru & Sekolah telah berjaya disimpan ke pangkalan data!
                              </p>`
                            );
                          } else if (typeof (window as any).showAppToast === "function") {
                            (window as any).showAppToast("Berjaya Disimpan", "Maklumat Guru & Sekolah berjaya disimpan!");
                          }
                        }}
                        title="Simpan Maklumat Guru"
                        aria-label="Simpan Maklumat Guru"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Guru</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          const f = editNamaKeluargaTemp.trim().toUpperCase();
                          if (!f) {
                            setEditModalError("Sila masukkan Nama Keluarga!");
                            return;
                          }

                          localStorage.setItem("bunyiKataNamaKeluarga", f);
                          const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                          if (famTitle) famTitle.innerText = f;

                          try {
                            await updateParentFamilyAndNameInFirebase({
                              namaKeluarga: f,
                            });
                          } catch (err) {
                            console.warn("Firebase parent update err:", err);
                          }

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Keluarga telah berjaya disimpan ke pangkalan data!
                              </p>`
                            );
                          } else if (typeof (window as any).showAppToast === "function") {
                            (window as any).showAppToast("Berjaya Disimpan", "Maklumat Keluarga berjaya disimpan!");
                          }
                        }}
                        title="Simpan Maklumat Keluarga"
                        aria-label="Simpan Maklumat Keluarga"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Keluarga</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
    </>
  );
}
