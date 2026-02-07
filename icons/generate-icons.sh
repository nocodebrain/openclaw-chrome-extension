#!/bin/bash
# Generate simple placeholder icons using ImageMagick
# Run this if you have ImageMagick installed, otherwise use any 🔱 emoji as icon

convert -size 16x16 xc:black -fill white -pointsize 12 -gravity center -annotate +0+0 "🔱" icon16.png 2>/dev/null || echo "Install ImageMagick to generate icons"
convert -size 48x48 xc:black -fill white -pointsize 36 -gravity center -annotate +0+0 "🔱" icon48.png 2>/dev/null
convert -size 128x128 xc:black -fill white -pointsize 96 -gravity center -annotate +0+0 "🔱" icon128.png 2>/dev/null
