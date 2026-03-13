import {
  GithubOutlined,
  LinkOutlined,
  ReloadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

type ProjectItem = {
  name: string;
  status: 'active' | 'live' | 'paused' | 'blocked';
  category: string;
  github: boolean;
  deploy: boolean;
  note: string;
  githubUrl?: string | null;
  pagesUrl?: string | null;
  stars?: number;
  visibility?: string | null;
};

type Summary = {
  total: number;
  active: number;
  live: number;
  github: number;
  deploy: number;
};

type ProjectsResponse = {
  success: boolean;
  data: ProjectItem[];
  summary: Summary;
};

const statusColorMap: Record<string, string> = {
  active: 'processing',
  live: 'success',
  paused: 'default',
  blocked: 'error',
};

const statusLabelMap: Record<string, string> = {
  active: '進行中',
  live: '已上線',
  paused: '暫停',
  blocked: '卡住',
};

const emptySummary: Summary = {
  total: 0,
  active: 0,
  live: 0,
  github: 0,
  deploy: 0,
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Request failed: ${url} (${res.status})`);
  }
  return res.json();
}

const ProjectCommandCenter: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [summary, setSummary] = useState<Summary>(emptySummary);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let res: ProjectsResponse | null = null;
      try {
        res = await getJson<ProjectsResponse>('/api/projects');
      } catch {
        const base = window.location.pathname.startsWith(
          '/project-command-center',
        )
          ? '/project-command-center/'
          : '/';
        res = await getJson<ProjectsResponse>(`${base}projects.json`);
      }
      setProjects(res?.data || []);
      setSummary(res?.summary || emptySummary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) =>
      [project.name, project.category, project.note]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [keyword, projects]);

  return (
    <PageContainer
      title="Project Command Center"
      subTitle="Sean 的專案總控台"
      extra={[
        <Button
          key="refresh"
          icon={<ReloadOutlined />}
          onClick={loadProjects}
          loading={loading}
        >
          Refresh
        </Button>,
        <Button key="new" type="primary" disabled>
          New Project
        </Button>,
      ]}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <ProCard gutter={16} wrap>
          <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }}>
            <StatisticCard
              statistic={{ title: '專案總數', value: summary.total }}
              loading={loading}
            />
          </ProCard>
          <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }}>
            <StatisticCard
              statistic={{ title: '進行中', value: summary.active }}
              loading={loading}
            />
          </ProCard>
          <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }}>
            <StatisticCard
              statistic={{ title: '已上線', value: summary.live }}
              loading={loading}
            />
          </ProCard>
          <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }}>
            <StatisticCard
              statistic={{ title: '有 GitHub', value: summary.github }}
              loading={loading}
            />
          </ProCard>
        </ProCard>

        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card
              title="專案清單"
              extra={
                <Input.Search
                  placeholder="搜尋專案 / 類型 / 備註"
                  allowClear
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: 260 }}
                />
              }
            >
              <Table
                rowKey="name"
                loading={loading}
                pagination={{ pageSize: 10 }}
                dataSource={filteredProjects}
                columns={[
                  {
                    title: '專案',
                    dataIndex: 'name',
                    render: (_, record: ProjectItem) => (
                      <Space direction="vertical" size={0}>
                        <Typography.Text strong>{record.name}</Typography.Text>
                        <Typography.Text type="secondary">
                          {record.note}
                        </Typography.Text>
                      </Space>
                    ),
                  },
                  {
                    title: '狀態',
                    dataIndex: 'status',
                    width: 100,
                    render: (value: string) => (
                      <Badge
                        status={statusColorMap[value] as any}
                        text={statusLabelMap[value]}
                      />
                    ),
                  },
                  {
                    title: '類型',
                    dataIndex: 'category',
                    width: 120,
                    render: (value: string) => <Tag>{value}</Tag>,
                  },
                  {
                    title: 'GitHub',
                    dataIndex: 'githubUrl',
                    width: 160,
                    render: (_, record: ProjectItem) =>
                      record.githubUrl ? (
                        <Space>
                          <a
                            href={record.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Repo
                          </a>
                          <Tag
                            color={
                              record.visibility === 'private' ? 'gold' : 'blue'
                            }
                          >
                            {record.visibility || 'public'}
                          </Tag>
                        </Space>
                      ) : (
                        <Tag>Pending</Tag>
                      ),
                  },
                  {
                    title: 'Stars',
                    dataIndex: 'stars',
                    width: 90,
                    render: (value: number) => (
                      <Space size={4}>
                        <StarOutlined />
                        <span>{value ?? 0}</span>
                      </Space>
                    ),
                  },
                  {
                    title: 'Pages',
                    dataIndex: 'pagesUrl',
                    width: 100,
                    render: (value: string | null) =>
                      value ? (
                        <a href={value} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      ) : (
                        <Tag>None</Tag>
                      ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Card title="下一步">
                <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                  <li>串 Vercel / 部署網址</li>
                  <li>加入專案狀態編輯與備註</li>
                  <li>補上專案詳情頁</li>
                  <li>加入 GitHub 最近更新時間</li>
                </ul>
              </Card>
              <Card title="快捷入口">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button block icon={<GithubOutlined />}>
                    GitHub Repos
                  </Button>
                  <Button block icon={<LinkOutlined />}>
                    Deploy Links
                  </Button>
                  <Button block>Project Health Check</Button>
                </Space>
              </Card>
              <Card title="目前重點">
                <Typography.Paragraph style={{ marginBottom: 8 }}>
                  現在這版已經同時顯示：
                  <Typography.Text code>
                    本地專案 + GitHub Repo + Pages + Stars
                  </Typography.Text>
                  。
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  下一步把 Vercel、備註與狀態管理接進來，這個 Dashboard
                  就會更接近完整的專案營運面板。
                </Typography.Paragraph>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
    </PageContainer>
  );
};

export default ProjectCommandCenter;
