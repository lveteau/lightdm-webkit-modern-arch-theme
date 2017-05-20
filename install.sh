#!/bin/bash
echo "Installing lightdm-webkit2-greeter arch theme..."
mkdir -p /usr/share/lightdm-webkit/themes/ltheme
cp -R ./* /usr/share/lightdm-webkit/themes/ltheme/
echo "Theme installed."
