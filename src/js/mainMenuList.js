export default [
    {
      id: 1, //114
      label: '玩家資料',
      children: [
        {
          id: 11,
          label: '基本資料',
          children: [
            {
              id: 1004,
              label: '玩家清單',
              index: '/user/account', 
              component: ()=>import('/src/components/page/UserAccount.vue')
            },
            {
              id: 101,
              label: '玩家資料',
              index: '/user/data',
              component: ()=>import('/src/components/user_page/UserData.vue'),
            },
          ]
        },
        {
          id: 12,
          label: '操作日誌',
          children: [
            {
              id: 103,
              label: '資源',
              index: '/server/resource-logs', 
              component: ()=>import('/src/components/server_page/ServerResources.vue'),
              disable: true
            },

          ]
        },
        
      ],
    },
    {
      id: 2,
      label: '伺服器統計',
      children: [
        {
          id: 21,  
          label: '營運指標統計',
          children: [
            {
              id: 1002,
              label: '同時在線',
              index: '/statistic/pcu',
              component: ()=>import('/src/components/page/Pcu.vue')
            },

            
            {
              id: 208,
              label: '商店統計',
              index: '/server/mall', 
              component: ()=>import('/src/components/server_page/ServerMall.vue'),
            },
          ]
        },
        {
          id: 22,
          label: '玩家統計',
          children: [
            {
              id: 206,
              label: '角色 (*)',
              index: '/server/character-logs', 
              component: ()=>import('/src/components/server_page/ServerCharacter.vue'),
              disable: true
            },

          ]
        },
        
      ],
    },
    {
      id: 3,
      label: '伺服器管理',
      children: [
        {
          label: '信件寄送',
          id: 32,
          children: [
            {
              id: 1038,
              label: '即時廣播',
              index: '/operator/broadcast', 
              component: ()=>import('/src/components/page/OptionBroadcast.vue') 
            },
            {
              id: 1039,
              label: '發送郵件&道具',
              index: '/operator/send-mail', 
              component: ()=>import('/src/components/page/OptionSendMail.vue') 
            },
            {
              id: 1040,
              label: '公告設置',
              index: '/operator/announcement', 
              component: ()=>import('/src/components/page/OptionAnnouncement.vue') 
            },
            {
              id: 1043,
              label: '封禁帳號&IP',
              index: '/operator/freeze-player', 
              component: ()=>import('/src/components/page/OptionFreeze.vue') 
            },
          ]
        },
        {
          id: 34,
          label: '其他',
          children: [
            {
              id: 313,
              label: '編輯禮包',
              index: '/option/gifbox-modify',
              component: ()=>import('/src/components/option_page/OptionGiftboxModify.vue'),
            },
          ]
        },
      ],
    },
    {
      id: 4,
      label: '帳號+權限管理',
      children: [
        {
          id: 41,  
          label: '帳號+權限管理',
          children: [
            {
              id: 401,
              label: '新增帳戶', 
              index: '/accounts/create', 
              component: ()=>import('/src/components/accounts_manage_page/AccountCreate.vue'),
            },
            {
              id: 402,
              label: '使用者管理',
              index: '/accounts/userlist', 
              component: ()=>import('/src/components/accounts_manage_page/AccountUserList.vue'),
            },
            {
              id: 403,
              label: '權限管理',
              index: '/accounts/roles',
              component: ()=>import('/src/components/accounts_manage_page/AccountRoles.vue'),
            },
          ]
        },
      ],
    },
  ]