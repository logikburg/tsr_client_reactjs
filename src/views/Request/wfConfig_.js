export default {
    "services":
    {
        "server":
            [
                [{
                    "stage_id": 1,
                    "stage_name": "reqManager",
                    "name": "Requester Manager Approval"

                },
                {
                    "stage_id": 2,
                    "stage_name": "supManager",
                    "name": "Support Team Approval",
                    "approvers": [{
                        "group_id": 4,
                        "group_name": "T3SupportMgr"
                    }]
                },
                {
                    "stage_id": 3,
                    "stage_name": "supTeam",
                    "approvers": [{
                        "group_id": 9,
                        "group_name": "T3Support"
                    }],
                    "name": "Support Team Handling",
                }]
            ],
        "database":
            [
                [{
                    "stage_id": 1,
                    "name": "Requester Manager Approval",
                    "stage_name": "reqManager"

                },
                {
                    "stage_id": 2,
                    "name": "Support Team Approval",
                    "stage_name": "supManager",
                    "approvers": [{
                        "group_id": 5,
                        "group_name": "SC3SupportMgr"
                    }],

                },
                {
                    "stage_id": 3,
                    "stage_name": "supTeam",
                    "approvers": [{
                        "group_id": 10,
                        "group_name": "SC3Support"
                    }],
                    "name": "Support Team Handling"

                }]
            ],
        "dns": [
            [
                {
                    "stage_id": 1,
                    "stage_name": "supTeam",
                    "approvers": [{
                        "group_id": 9,
                        "group_name": "T3Support"
                    }],
                    "name": "Support Team Handling"

                }
            ]
        ],
        "backup": [
            [{
                "stage_id": 1,
                "name": "Requester Manager Approval",
                "stage_name": "reqManager"

            },
            {
                "stage_id": 2,
                "stage_name": "supTeam",
                "approvers": [{
                    "group_id": 11,
                    "group_name": "T4Support"
                }],
                "name": "Support Team Handling"

            }
            ]
        ],
        "storage": [
            [{
                "stage_id": 1,
                "name": "Requester Manager Approval",
                "stage_name": "reqManager"

            },
            {
                "stage_id": 2,
                "name": "Support Team Approval",
                "stage_name": "supManager",
                "approvers": [{
                    "group_id": 6,
                    "group_name": "T4SupportMgr"
                }],

            },
            {
                "stage_id": 3,
                "stage_name": "supTeam",
                "approvers": [{
                    "group_id": 11,
                    "group_name": "T4Support"
                }],
                "name": "Support Team Handling"

            }]
        ],
        "email": [
            [{
                "stage_id": 1,
                "name": "Requester Manager Approval",
                "stage_name": "reqManager"

            },
            {
                "stage_id": 2,
                "stage_name": "supTeam",
                "approvers": [{
                    "group_id": 16,
                    "group_name": "N4Support"
                }],
                "name": "Support Team Handling"

            }
            ]
        ],
        "ibra": [
            [{
                "stage_id": 1,
                "name": "Requester Manager Approval",
                "stage_name": "reqManager"

            },
            {
                "stage_id": 2,
                "stage_name": "supTeam",
                "approvers": [{
                    "group_id": 18,
                    "group_name": "N6Support"
                }],
                "name": "Support Team Handling"

            }
            ]

        ],
        "eCert": [
            [{
                "stage_id": 1,
                "name": "Requester Manager Approval",
                "stage_name": "reqManager"

            },
            {
                "stage_id": 2,
                "name": "Support Team Approval",
                "stage_name": "supManager",
                "approvers": [{
                    "group_id": 8,
                    "group_name": "N6SupportMgr"
                }],

            },
            {
                "stage_id": 3,
                "stage_name": "supTeam",
                "approvers": [{
                    "group_id": 18,
                    "group_name": "N6Support"
                }],
                "name": "Support Team Handling"

            }]
        ],
        "userAccount": [
            [
                {
                    "stage_id": 1,
                    "stage_name": "supTeam",
                    "approvers": [{
                        "group_id": 9,
                        "group_name": "T3Support"
                    }],
                    "name": "Support Team Handling"

                }
            ]

        ]
    }

}
