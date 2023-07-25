export interface NavBarItemSheet {
  Title: string;
  Link: string;
}

export interface NavBarItem {
  Name: string;
  Sheets: NavBarItemSheet[];
}

export const navBarItems: {
  documents: NavBarItem[];
} = {
  documents: [
    {
      Name: 'USER',
      Sheets: [
        {
          Title: 'Dashboard',
          Link: '/userdashboard',
        },
      ],
    },
    {
      Name: 'HOST',
      Sheets: [
        {
          Title: 'Dashboard',
          Link: '/hostdashboard',
        },
      ],
    },
    {
      Name: 'ACCOUNT',
      Sheets: [
        {
          Title: 'Profile',
          Link: '/profile',
        },
        {
          Title: 'Billing Information',
          Link: '/billing',
        },
        {
          Title: 'Support',
          Link: '/support',
        },
      ],
    },
  ],
};
