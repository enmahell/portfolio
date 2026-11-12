/* Contenu du portfolio (FR / EN) */
(function(){
const T=(fr,en)=>({fr,en});
window.SITE={
T,
SKILLS:[
  {word:"CISCO",t:T("Réseaux et sécurité","Networks & security"),p:T("Routage, commutation et filtrage sur équipements Cisco et pare-feu Stormshield. Mon point fort.","Routing, switching and filtering on Cisco gear and Stormshield firewalls. My strongest area."),tags:["Cisco IOS","Stormshield NGFW","TCP/IP","VLAN 802.1Q","ACL","NAT/PAT","OSPF / RIP / EIGRP","Wireshark","Nmap"]},
  {word:"LINUX",t:T("Systèmes et virtualisation","Systems & virtualisation"),p:T("Administration Debian et Windows Server, machines virtuelles isolées et supervision de services.","Debian and Windows Server administration, isolated VMs and service monitoring."),tags:["Debian","Windows Server","KVM / QEMU","Icinga 2","Grafana"]},
  {word:"PY",t:T("Scripts et automatisation","Scripting & automation"),p:T("Automatiser plutôt que répéter : scripts d'administration à distance et petites applications web.","Automate rather than repeat: remote administration scripts and small web apps."),tags:["Python 3","Bash","Fabric / Paramiko","Flask","HTML5 / CSS3","PHP"]},
  {word:"DATA",t:T("Données et services","Data & services"),p:T("Bases de données pour capteurs, services réseau essentiels et messagerie IoT.","Sensor databases, core network services and IoT messaging."),tags:["InfluxDB","MariaDB / MySQL","DHCP / dnsmasq","DNS","Apache","SSH","OpenLDAP","MQTT / Mosquitto"]}
],
SOFT:[
  {c:"AUT",t:T("Rigueur et autonomie","Rigour & autonomy"),l:[T("Sens des responsabilités","Sense of responsibility"),T("Gestion des priorités","Priority management"),T("Fiabilité technique","Technical reliability")]},
  {c:"COL",t:T("Esprit d'équipe","Teamwork"),l:[T("Travail collaboratif","Collaborative work"),T("Relation client","Customer relations"),T("Écoute active","Active listening")]},
  {c:"LOG",t:T("Analyse et logique","Analysis & logic"),l:[T("Esprit stratégique","Strategic thinking"),T("Résolution de problèmes","Problem solving"),T("Anticipation (cyber)","Anticipation (cyber)")]},
  {c:"ADA",t:T("Adaptabilité","Adaptability"),l:[T("Apprentissage rapide","Fast learner"),T("Veille technologique","Tech watch"),T("Polyvalence","Versatility")]}
],
PROJ:[
  {word:"XSS",kind:T("SAÉ Cybersécurité","Cybersecurity project"),t:T("Pentest et sécurité","Pentest & security"),d:T("Architecture sécurisée, scénarios d'attaque en groupe et exploitation (XSS, Hydra).","Secure architecture, group attack scenarios and exploitation (XSS, Hydra)."),
   ctx:T("Projet de groupe (4 personnes) à Luminy : concevoir une architecture d'entreprise (DMZ, réseau interne), auditer sa sécurité puis exploiter ses vulnérabilités avec des scénarios d'attaque personnalisés.","Group project (4 people) at Luminy: design a corporate architecture (DMZ, internal network), audit its security, then exploit its vulnerabilities with custom attack scenarios."),
   impl:{fr:["Infrastructure avec serveurs web <strong>Apache</strong>, bases <strong>MySQL</strong> et annuaire <strong>OpenLDAP</strong>.","Tests d'intrusion : chaque membre a conçu et exécuté son propre scénario d'attaque.","<strong>Mon rôle :</strong> exploitation d'une faille <strong>XSS</strong> et attaque par force brute avec <strong>Hydra</strong> pour compromettre des identifiants.","Défense : détection d'intrusion avec l'IDS <strong>Snort</strong> et règles de filtrage <strong>NetFilter</strong>."],
         en:["Infrastructure with <strong>Apache</strong> web servers, <strong>MySQL</strong> databases and an <strong>OpenLDAP</strong> directory.","Penetration testing: each member designed and ran their own attack scenario.","<strong>My role:</strong> exploiting an <strong>XSS</strong> flaw and a brute-force attack with <strong>Hydra</strong> to compromise credentials.","Defence: intrusion detection with the <strong>Snort</strong> IDS and <strong>NetFilter</strong> filtering rules."]},
   ev:T("Un tournant : apprendre à penser comme un attaquant (Red Team) pour construire une défense bien plus efficace (Blue Team), en passant de la théorie à la pratique réelle.","A turning point: learning to think like an attacker (Red Team) to build much stronger defences (Blue Team), moving from theory to real practice."),
   stack:["Kali Linux","Snort","NetFilter","Hydra","XSS","LDAP"]},
  {word:"LOGS",kind:T("SAÉ 302","SAÉ 302"),t:T("Centralisation de logs","Log centralisation"),d:T("Application web Python (Flask) pour consulter les journaux de machines distantes via SSH.","Python (Flask) web app to read remote machine logs over SSH."),
   ctx:T("Développement d'une application web d'administration centralisée pour superviser les journaux d'une infrastructure réseau distribuée.","Building a centralised admin web app to monitor logs across a distributed network infrastructure."),
   impl:{fr:["Back-end complet en <strong>Python</strong> avec le micro-framework <strong>Flask</strong>.","Connexions distantes et extraction des journaux (syslog) via <strong>SSH</strong> avec Fabric et Paramiko.","Système d'authentification et gestion des droits d'accès."],
         en:["Full <strong>Python</strong> back end with the <strong>Flask</strong> micro-framework.","Remote connections and log extraction (syslog) over <strong>SSH</strong> with Fabric and Paramiko.","Authentication system and access-rights management."]},
   ev:T("Ma première vraie expérience « DevOps » : j'ai compris l'importance de centraliser les logs pour réagir vite, et je suis passé de scripts isolés à une application structurée et maintenable.","My first real “DevOps” experience: I understood why centralising logs matters for fast reaction, and moved from isolated scripts to a structured, maintainable app."),
   stack:["Python 3","Flask","Fabric / Paramiko","Linux Syslog"]},
  {word:"DHCP",kind:T("SAÉ Admin réseaux et systèmes","Systems & networks admin project"),t:T("Supervision DHCP","DHCP supervision"),d:T("Gestion centralisée des baux DHCP multi-sites avec VLAN, NAT et automatisation Python/Fabric.","Centralised multi-site DHCP lease management with VLAN, NAT and Python/Fabric automation."),
   ctx:T("Architecture réseau multi-sites et outil Python pour gérer de façon centralisée des serveurs DHCP distants.","Multi-site network architecture and a Python tool to centrally manage remote DHCP servers."),
   impl:{fr:["Architecture virtualisée sous <strong>Debian 11</strong> avec un serveur central routeur <strong>NAT</strong>.","<strong>VLAN (802.1Q)</strong> isolés et services DHCP avec <strong>dnsmasq</strong>.","Outil CLI en <strong>Python</strong> avec <strong>Fabric</strong> pour l'administration à distance via <strong>SSH</strong> (attribution d'IP par adresse MAC).","Accès sans mot de passe par clés <strong>RSA</strong>, <strong>authorized_keys</strong> et <strong>sudo</strong> restreint."],
         en:["Virtualised architecture on <strong>Debian 11</strong> with a central <strong>NAT</strong> router.","Isolated <strong>VLANs (802.1Q)</strong> and DHCP services with <strong>dnsmasq</strong>.","<strong>Python</strong> CLI tool using <strong>Fabric</strong> for remote admin over <strong>SSH</strong> (IP allocation by MAC address).","Passwordless access with <strong>RSA</strong> keys, <strong>authorized_keys</strong> and restricted <strong>sudo</strong>."]},
   ev:T("La SAÉ qui m'a fait basculer vers l'automatisation : un parc multi-sites ne se gère plus à la main, ce qui m'a poussé à gagner en rigueur et à maîtriser des outils comme Fabric.","The project that pushed me into automation: a multi-site fleet can't be managed by hand, which made me more rigorous and taught me tools like Fabric."),
   stack:["Debian 11","VLAN / NAT","Python 3","Fabric (SSH)","dnsmasq","YAML"]},
  {word:"CAM",kind:T("SAÉ 103 et 202","SAÉ 103 & 202"),t:T("Vidéosurveillance","Video surveillance"),d:T("Système de sécurité Python avec caméra IP Axis : détection de mouvement, badge, captures et alertes e-mail.","Python security system with an Axis IP camera: motion detection, badge check, captures and email alerts."),
   ctx:T("Système de vidéosurveillance automatisé en Python, piloté par une caméra IP Axis, pour sécuriser un accès.","Automated Python video-surveillance system driving an Axis IP camera to secure an entrance."),
   impl:{fr:["Connexion et pilotage d'une <strong>caméra IP Axis</strong> par script <strong>Python</strong>.","Algorithme de <strong>détection de mouvement</strong> en temps réel.","Temporisation de <strong>5 secondes</strong> pour présenter un badge d'accès valide.","Sans badge : capture d'écran et <strong>envoi automatique d'un e-mail</strong> d'alerte avec la photo."],
         en:["Connecting to and controlling an <strong>Axis IP camera</strong> with a <strong>Python</strong> script.","Real-time <strong>motion detection</strong> algorithm.","A <strong>5-second</strong> window to present a valid access badge.","No badge: screenshot and <strong>automatic email alert</strong> with the photo."]},
   ev:T("Relier du code à du matériel de sécurité physique a été une révélation : répondre à un cahier des charges précis en gérant des événements en temps réel m'a rendu bien plus autonome.","Linking code to physical security hardware was an eye-opener: meeting precise specs with real-time event handling made me far more autonomous."),
   stack:["Python","Axis","Motion detection","Email alert"]}
],
PASS:[
  {img:"photo/Homelab.jpg",c:"SRV",t:T("Homelab","Homelab"),d:T("Auto-hébergement sur du matériel recyclé : Pi-hole, serveurs locaux et services persos.","Self-hosting on recycled hardware: Pi-hole, local servers and personal services.")},
  {img:"photo/Gaming.jpg",c:"GAME",t:T("Gaming","Gaming"),d:T("Mon moyen favori pour décompresser et jouer en équipe.","My favourite way to unwind and play as a team.")},
  {img:"photo/Football.jpg",c:"FOOT",t:T("Football","Football"),d:T("Pratique régulière : cardio et esprit d'équipe.","Regular play: cardio and team spirit.")},
  {img:"photo/Randonnée.jpg",c:"WALK",t:T("Randonnée","Hiking"),d:T("Déconnecter des écrans, explorer de nouveaux paysages.","Disconnect from screens and explore new landscapes.")},
  {img:"photo/Échecs.jpg",c:"CHSS",t:T("Échecs","Chess"),d:T("Analyse, patience et anticipation : parfait pour la cybersécurité.","Analysis, patience and anticipation: perfect training for cybersecurity.")},
  {img:"photo/Cinéma.jpg",c:"FILM",t:T("Cinéma","Cinema"),d:T("Petit cinéphile, fan de fantasy et de thrillers psychologiques.","A bit of a movie buff, into fantasy and psychological thrillers.")}
],
MARQ:["Cisco","Stormshield","Debian","VLAN","Python","OSPF","KVM","Grafana","Snort","MQTT","Wireshark","Icinga"]
};
})();
