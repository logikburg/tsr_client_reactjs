export default {
    "services":
    {
        "server":
            [{
                "location": "",
                "type": "",
                "env": "",
                "os": "",
                "app": "",
                "cpu": "",
                "memory": "",
                "disk": "",
                "sw": "",
                "justification": "",
                "backup": "",
                "hostname": ""
            }],
        "database":
            [{
                location: '',
                platform_type: '',
                os_version: '',
                env: '',
                type: '',
                db_version: '',
                network: '',
                disk: "",
                sw: '',
                justification: '',
                backup: '',
                hostname: '',
                sql_server: '',
                sql_instance: '',

                sql_port: '',
                sql_memory: '',
                sql_account: ''
            }],
        "dns": [
            {
                "server_type": "",
                "app_name": "",
                "failover": "",
                "ttl": "",
                "load_balancing": "",
                "pool_num": "",
                "pr_hostname": "",


                "pr_ip_addr": "",

                "pr_port_num": "",
                "st_hostname": "",
                "st_ip_addr": "",
                "field": "",
                "st_port_num": "",

            }
        ],
        "backup": [
            {
                "backup_sw": "",
                "fqdn": "",
                "fqdn_atl": "",
                "dns": "",
                "firewall_protected": "",
                "platform": "",
                "host_type": "",
                "clustering": "",
                "cluster_hostname": "",
                "remote_standby": "",
                "db_type": "",
            }
        ],
        "storage": [
            {
                "action_type": "",
                "cluster_hostname": "",
                "remote_standby": "",
                "db_type": "",
            }
        ],
        "email": [
            {
                "req_type": "",
                "src_ip": "",
                "env": "",
                "purpose": "",
                "remarks": "",
                "emails_num": "",

            }
        ],
        "firewall": [
            {
                "source": "",
                "destination": "",
                "service": "",
                "protocol": "",
                "port": "",
                "purpose": "",
                "hosts": [{
                    "hostname": "",
                    "ip": "",
                    "owner": ""
                }]
            }
        ],
        "ibra": [
            {
                "ip": "",
                "hostname": "",
                "owner": "",
                "service": "",
                "protocol": "",
                "port_num": "",
                "purpose": "",
                "data_classification": "",
                "info": ""
            }
        ],
        "eCert": [
            {
                "issue_ca": "",
                "server_name": "",
                "srv_location": "",
                "site_access": "",
                "site_addr": "",
                "web_app": "",
                "users": "",
                "req_type": "",
                "hash_alg": "",
                "csr_file": ""
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
