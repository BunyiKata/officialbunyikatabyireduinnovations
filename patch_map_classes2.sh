sed -i "777,779c\
                const lockedClass = isLockedForUser ? 'locked' : '';\
                const activeClass = (!isLockedForUser && moduleIndex === unlockedIndex) ? 'active-level' : '';\
                const completedClass = (!isLockedForUser && moduleIndex < unlockedIndex) ? 'completed-level' : '';\
" public/app.js
