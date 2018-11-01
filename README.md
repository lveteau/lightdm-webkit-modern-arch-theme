LightDM Webkit Modern Arch Theme
===========================

This is a LightDM webkit greeter theme for Archlinux. Based on [LightDM-Webkit-Archlinux-Theme](https://github.com/shosca/lightdm-webkit-archlinux-theme)

**CHROME/CHROMIUM/VIVALDI ONLY** Test it here => https://lveteau.github.io/wktheme/

Installation Instructions
-------------------------
You will need lightdm as your login manager and the lightdm-webkit2-greeter from AUR. You need to make the webkit greeter the default greeter. This is done by editing the lightdm configuration under:

<pre>
/etc/lightdm/lightdm.conf
</pre>

and changing the greeter-session value to lightdm-webkit2-greeter. lightdm.conf should have:

<pre>
[SeatDefaults]
greeter-session=lightdm-webkit2-greeter
allow-guest=false
</pre>

The second step is to install the actual theme. This is done by copying the files to a temporary location and open a terminal in the downloaded folder, type this :

<pre>
./install.sh
</pre>

Finally, change the /etc/lightdm/lightdm-webkit2-greeter.conf file to contain the following line:

<pre>
webkit-theme=ltheme
</pre>

Screenshots
-------------------------
![Alt text](https://cdn.discordapp.com/attachments/297050239616155659/315736139770232835/Capture_decran_de_2017-05-21_08-15-30.png "Screen")
![Alt text](https://cdn.discordapp.com/attachments/297050239616155659/315736216244977664/Capture_decran_de_2017-05-21_08-15-37.png "Screen")
![Alt text](https://cdn.discordapp.com/attachments/297050239616155659/315736245202452480/Capture_decran_de_2017-05-21_08-15-46.png "Screen")
![Alt text](https://cdn.discordapp.com/attachments/297050239616155659/315736253897375744/Capture_decran_de_2017-05-21_08-15-53.png "Screen")
Now you can reboot and enjoy the new theme.
