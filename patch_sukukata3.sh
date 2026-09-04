#!/bin/bash

# Ensure bs-wrapper is moved up on mobile
sed -i 's/margin-top: 10px !important;/margin-top: -15px !important;/g' public/styles.css

# Fix the arrow buttons (petak) border-radius
sed -i 's/border-radius: 12px/border-radius: 10px/g' index.html
sed -i 's/border-radius: 12px !important;/border-radius: 10px !important;/g' public/styles.css

