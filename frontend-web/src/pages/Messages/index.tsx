import { useState } from 'react';
import { Card, Row, Col, List, Avatar, Input, Button, Badge, Tag } from 'tdesign-react';
import { SendIcon, AttachIcon } from 'tdesign-icons-react';
import './Messages.css';

const mockConversations = [
  {
    id: '1',
    name: '张**',
    title: '高级前端工程师',
    company: '字节跳动',
    lastMessage: '您好，我对贵公司的高级前端工程师岗位很感兴趣...',
    time: '14:30',
    unread: 3,
    avatar: '',
  },
  {
    id: '2',
    name: '李**',
    title: '产品经理',
    company: '阿里巴巴',
    lastMessage: '好的，我已经收到了面试邀请，请问...',
    time: '昨天',
    unread: 0,
    avatar: '',
  },
  {
    id: '3',
    name: '王**',
    title: 'Java架构师',
    company: '腾讯',
    lastMessage: '感谢您的回复，我会准时参加面试',
    time: '周三',
    unread: 0,
    avatar: '',
  },
];

const mockMessages = [
  { id: 1, sender: 'other', content: '您好，我对贵公司的高级前端工程师岗位很感兴趣，我有5年React开发经验，希望能够有机会沟通。', time: '14:20' },
  { id: 2, sender: 'me', content: '您好，感谢您的关注。请问您方便发送一份简历吗？', time: '14:25' },
  { id: 3, sender: 'other', content: '好的，我已经发送简历到您的邮箱了，请查收。', time: '14:28' },
  { id: 4, sender: 'me', content: '收到，您的简历很符合我们的要求，请问您下周一下午方便来公司面试吗？', time: '14:30' },
];

export default function Messages() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="messages">
      <Row gutter={0} style={{ height: 'calc(100vh - 140px)' }}>
        <Col span={6}>
          <Card className="conversation-list" title="消息">
            <div className="tab-nav" style={{ marginBottom: 16 }}>
              {[
                { key: 'all', label: '全部' },
                { key: 'unread', label: '未读' },
                { key: 'system', label: '系统通知' },
              ].map((tab) => (
                <Tag
                  key={tab.key}
                  theme={activeTab === tab.key ? 'primary' : 'default'}
                  variant={activeTab === tab.key ? 'dark' : 'outline'}
                  className="tab-tag"
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </Tag>
              ))}
            </div>
            <List>
              {mockConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
                  style={{ padding: '12px', cursor: 'pointer' }}
                >
                  <List.ListItemMeta
                    image={<Avatar>{conv.name[0]}</Avatar>}
                    title={
                      <div className="conv-header">
                        <span className="conv-name">{conv.name}</span>
                        <span className="conv-time">{conv.time}</span>
                      </div>
                    }
                    description={
                      <div className="conv-preview">
                        <span className="conv-title">{conv.title}</span>
                        <span className="conv-msg">{conv.lastMessage}</span>
                      </div>
                    }
                  />
                  {conv.unread > 0 && (
                    <Badge count={conv.unread} />
                  )}
                </div>
              ))}
            </List>
          </Card>
        </Col>

        <Col span={18}>
          <Card className="chat-area">
            <div className="chat-header">
              <div className="chat-user-info">
                <Avatar>张</Avatar>
                <div>
                  <div className="chat-user-name">张**</div>
                  <div className="chat-user-title">高级前端工程师 · 字节跳动</div>
                </div>
              </div>
              <Button theme="default" size="small">查看简历</Button>
            </div>

            <div className="message-list">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`message-item ${msg.sender}`}>
                  <div className="message-content">
                    {msg.content}
                  </div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="message-input">
              <Button theme="default" variant="text" icon={<AttachIcon />}>
                附件
              </Button>
              <Input
                value={messageInput}
                onChange={(value) => setMessageInput(value)}
                placeholder="输入消息..."
                style={{ flex: 1, margin: '0 12px' }}
              />
              <Button theme="primary" icon={<SendIcon />}>
                发送
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
