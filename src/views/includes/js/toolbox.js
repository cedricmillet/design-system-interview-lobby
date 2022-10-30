/**
 * AWS ICONS
 */
const AWS_ICONS = [
    //  Resource-icons > Generic
    "Res_Amazon-Simple-Storage-Service_S3-Standard_48_Light.svg",
    "Res_Globe_48_Light.svg",
    "Res_Internet_48_Light.svg",
    "Res_Servers_48_Light.svg",
    "Res_Traditional-server_48_Light.svg",
    "Res_User_48_Light.svg",
    "Res_Source-Code_48_Light.svg",
    "Res_Mobile-client_48_Light.svg",
    "Res_Generic-database_48_Light.svg",
    "Res_Gear_48_Light.svg",
    //  Resource-icons > Database
    "Res_Amazon-Aurora-MySQL-Instance_48_Light.svg",
    "Res_Amazon-ElastiCache_ElastiCache-for-Redis_48_Light.svg",
    "Res_Amazon-ElastiCache_Cache-Node_48_Light.svg",
    "Res_Amazon-DynamoDB_Items_48_Light.svg",
    //  Category Icons
    'arch-category/Arch_AWS-Network-Firewall_48.svg',
    'arch-category/Arch-Category_Analytics_48.svg',
    'arch-category/Arch-Category_Application-Integration_48.svg',
    'arch-category/Arch-Category_Blockchain_48.svg',
    'arch-category/Arch-Category_Business-Applications_48.svg',
    'arch-category/Arch-Category_Cloud-Financial-Management_48.svg',
    'arch-category/Arch-Category_Compute_48.svg',
    'arch-category/Arch-Category_Containers_48.svg',
    'arch-category/Arch-Category_Customer-Enablement_48.svg',
    'arch-category/Arch-Category_Database_48.svg',
    'arch-category/Arch-Category_Developer-Tools_48.svg',
    'arch-category/Arch-Category_End-User-Computing_48.svg',
    'arch-category/Arch-Category_Front-End-Web-Mobile_48.svg',
    'arch-category/Arch-Category_Game-Tech_48.svg',
    'arch-category/Arch-Category_Internet-of-Things_48.svg',
    'arch-category/Arch-Category_Machine-Learning_48.svg',
    'arch-category/Arch-Category_Management-Governance_48.svg',
    'arch-category/Arch-Category_Media-Services_48.svg',
    'arch-category/Arch-Category_Migration-Transfer_48.svg',
    'arch-category/Arch-Category_Networking-Content-Delivery_48.svg',
    'arch-category/Arch-Category_Quantum-Technologies_48.svg',
    'arch-category/Arch-Category_Robotics_48.svg',
    'arch-category/Arch-Category_Satellite_48.svg',
    'arch-category/Arch-Category_Security-Identity-Compliance_48.svg',        
    'arch-category/Arch-Category_Serverless_48.svg',
    'arch-category/Arch-Category_Storage_48.svg',
    'arch-category/Arch-Category_VR-AR_48.svg'
];

const serviceIconsContainer = document.getElementById('service-icons');

for(const iconURI of AWS_ICONS) {
    const img = document.createElement('img');
    const url = `/assets/svg/${iconURI}`
    img.setAttribute('src', url);
    img.setAttribute('alt', iconURI);
    img.classList.add('service-icon');
    img.onclick = () => diagram.addImage(url)
    serviceIconsContainer.appendChild(img);
}


