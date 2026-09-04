import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_onboarding = """                            (window as any).selectedAvatarIcon = onboardingSelectedAvatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                            setShowOnboardingAvatar(false);
                            if (typeof (window as any).masukModMurid === 'function') {
                                (window as any).masukModMurid();
                            }"""

new_onboarding = """                            const avatar = onboardingSelectedAvatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                            (window as any).selectedAvatarIcon = avatar;
                            
                            // If a student is currently active, update their avatar immediately
                            const studentName = (window as any).namaMuridAktif || "Murid";
                            if (typeof (window as any).studentData !== 'undefined' && (window as any).studentData[studentName]) {
                                (window as any).studentData[studentName].avatar = avatar;
                                if (typeof (window as any).saveStudentData === 'function') {
                                    (window as any).saveStudentData();
                                }
                            }
                            
                            setShowOnboardingAvatar(false);
                            if (typeof (window as any).masukModMurid === 'function') {
                                (window as any).masukModMurid(studentName);
                            }"""

content = content.replace(old_onboarding, new_onboarding)

with open('src/App.tsx', 'w') as f:
    f.write(content)
