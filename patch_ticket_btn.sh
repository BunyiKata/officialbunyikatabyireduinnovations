cat << 'CSS' >> public/styles.css

.ticket-btn-red {
    background: none !important;
    border: 24px solid transparent !important;
    border-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M 15 3 L 45 3 A 12 12 0 0 0 57 15 L 57 45 A 12 12 0 0 0 45 57 L 15 57 A 12 12 0 0 0 3 45 L 3 15 A 12 12 0 0 0 15 3 Z' fill='%23EB5757' stroke='%23333333' stroke-width='4' stroke-linejoin='round'/%3E%3Cpath d='M 7 18 Q 8 8 18 7' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1.5' stroke-linecap='round' /%3E%3Cpath d='M 8 22 Q 11 11 22 8' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1.5' stroke-linecap='round' /%3E%3Cpath d='M 42 53 Q 52 52 53 42' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1.5' stroke-linecap='round' /%3E%3Cpath d='M 38 52 Q 49 49 52 38' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='1.5' stroke-linecap='round' /%3E%3C/svg%3E") 24 fill !important;
    color: white !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    filter: drop-shadow(2px 4px 0px rgba(0,0,0,0.5));
    text-shadow: 1px 2px 0 rgba(0,0,0,0.3);
    position: relative;
    padding: 0 16px !important; /* Adjust inner padding if needed */
    margin: 0 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: transform 0.2s, filter 0.2s;
}

.ticket-btn-red:hover {
    transform: translateY(-4px) scale(1.02) !important;
    filter: drop-shadow(2px 6px 0px rgba(0,0,0,0.4)) !important;
}

.ticket-btn-red:active {
    transform: translateY(2px) scale(0.98) !important;
    filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.5)) !important;
}

@media (max-width: 768px) {
    .ticket-btn-red {
        border-width: 20px !important;
        border-image-slice: 24 fill !important; 
        padding: 0 8px !important;
    }
}
CSS

sed -i 's/<button class="neo-btn bg-red" onclick="bukaModalPilihPeta('\''belajar'\'')">/<button class="neo-btn ticket-btn-red" onclick="bukaModalPilihPeta('\''belajar'\'')">/g' index.html
sed -i 's/<button class="neo-btn bg-green" onclick="bukaModalPilihPeta('\''latihan'\'')">/<button class="neo-btn ticket-btn-red" onclick="bukaModalPilihPeta('\''latihan'\'')">/g' index.html

