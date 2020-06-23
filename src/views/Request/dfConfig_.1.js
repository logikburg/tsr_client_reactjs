export default {
    "services":
    {
        "server":
            [{
                "location": "DC1",
                "type": "Web Server",
                "env": "Development",
                "os": "Windows 2016",
                "app": "",
                "cpu": "64",
                "memory": "128",
                "disk": "100",
                "sw": "",
                "justification": "",
                "backup": "",
                "hostname": "ha_host"
            }],
        "database":
            [{
                location: 'DC1',
                platform_type: 'Windows',
                os_version: '2016',
                env: 'Development',
                type: 'MSSQL',
                db_version: '2016',
                network: '',
                disk: 128,
                sw: 'Software',
                justification: '',
                backup: 'Yes',
                hostname: 'Hostname',
                sql_server: 'SQL Virtual Server Name',
                sql_instance: 'SQL Instance Name',

                sql_port: 'SQL Port',
                sql_memory: 'Max Memory for SQL',
                sql_account: 'SQL Service account'
            }],
        "dns": [
            {
                "server_type": "Windows",
                "app_name": "",
                "failover": "FailOver",
                "ttl": "TTL",
                "load_balancing": "Yes",
                "pool_num": "Pool Number",
                "pr_hostname": "Primary Hostname",


                "pr_ip_addr": "Primary IP Address",

                "pr_port_num": "Primary Port No",

                "st_hostname": "Standby Hostname",
                "st_ip_addr": "Standby IP Address",
                "field": "st_ip_addr",
                "st_port_num": "Standby Port No",

            }
        ],
        "backup": [
            {
                "backup_sw": "Backup Software",
                "fqdn": "FQDN (Production)",
                "fqdn_atl": "FQDN (ATL)",
                "dns": "DNS Reversed Lookup",
                "firewall_protected": "Yes",
                "platform": "Platform",
                "host_type": "Type of host",
                "clustering": "Clustering",
                "cluster_hostname": "Cluster Hostname",
                "remote_standby": "Remote Standby",
                "db_type": "Database Type",
            }
        ],
        "storage": [
            {
                "action_type": "Action Type",
                "cluster_hostname": "Capacity Plan Information",
                "remote_standby": "Number of Disk",
                "db_type": "Size of Disk",
            }
        ],
        "email": [
            {
                "req_type": "Request Type",
                "src_ip": "Source IP",
                "env": "Development",
                "purpose": "Purpose",
                "remarks": "Remarks",
                "emails_num": "Transaction volume (no of emails)",

            }
        ],
        "ibra": [
            {
                "ip": "IP",
                "hostname": "Hostname",
                "owner": "Owner",
                "service": "Service",
                "protocol": "Protocol",
                "port_num": "Port Number",
                "purpose": "Purpose",
                "data_classification": "Data Classification",
                "info": "Information"
            }
        ],
        "eCert": [
            {
                "issue_ca": "Issue CA",
                "server_name": "Server Name",
                "srv_location": "Server Location",
                "site_access": "Site Accessibility",
                "site_addr": "Site Address",
                "web_app": "Web Applications",
                "users": "Intended Users",
                "req_type": "Request Type",
                "hash_alg": "Hashing Algorithm",
                "csr_file": "CSR File"
            }
        ],
        "userAccount": [
            {
                "new_user_id": "",
                "supervisor_id": "",
            },
        ]
    }

}
