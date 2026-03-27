import { Outlet, useLocation } from 'react-router-dom';
import { Layout as TLayout, Menu } from 'tdesign-react';
import {
  HomeIcon,
  UsergroupIcon,
  SearchIcon,
  FolderIcon,
  BriefcaseIcon,
  ChatIcon,
  UserIcon,
} from 'tdesign-icons-react';
import './Layout.css';

const { Header, Content, Aside } = TLayout;

const menuItems = [
  { key: '/dashboard', icon: <HomeIcon />, label: '工作台' },
  { key: '/talent-market', icon: <UsergroupIcon />, label: '人才广场' },
  { key: '/talent-search', icon: <SearchIcon />, label: '人才搜索' },
  { key: '/resume-library', icon: <FolderIcon />, label: '简历库' },
  { key: '/jobs', icon: <BriefcaseIcon />, label: '职位管理' },
  { key: '/messages', icon: <ChatIcon />, label: '消息中心' },
  { key: '/profile', icon: <UserIcon />, label: '我的' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <TLayout className="main-layout">
      <Aside className="aside">
        <div className="logo">
          <span className="logo-text">猎脉</span>
          <span className="logo-subtitle">HuntLink</span>
        </div>
        <Menu
          theme="light"
          value={location.pathname}
          items={menuItems.map((item) => ({
            value: item.key,
            icon: item.icon,
            label: item.label,
          }))}
          onChange={({ value }) => {
            window.location.href = value as string;
          }}
        />
      </Aside>
      <TLayout>
        <Header className="header">
          <div className="header-right">
            <span className="header-title">
              {menuItems.find((item) => item.key === location.pathname)?.label || '猎脉'}
            </span>
          </div>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </TLayout>
    </TLayout>
  );
}
