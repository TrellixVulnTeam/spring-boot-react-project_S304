import {useState, useEffect} from 'react';
import { getAllStudents, deleteStudent } from './client';
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Button,
    Badge,
    Tag,
    Radio,
    Popconfirm,
    Image,
    Divider} from 'antd';
import { Empty } from 'antd';

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';

import {errorNotification, successNotification} from "./Notification";

import StudentDrawerForm from './StudentDrawerForm';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function App() {

     const removeStudent = (studentId, callback) => {
           deleteStudent(studentId).then(() => {
               successNotification( "Student deleted", `Student with ${studentId} was deleted`);
               callback();
           }).catch(error => {
                error.response.json().then(res => {
                           errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]` )
                       });
            });
       }

    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: 'Actions',
        render: (text, student) =>
                    <Radio.Group>
                        <Popconfirm
                            placement='topRight'
                            title={`Are you sure to delete ${student.name}`}
                            onConfirm={() => removeStudent(student.id, fetchStudents)}
                            okText='Yes'
                            cancelText='No'>
                            <Radio.Button value="small">Delete</Radio.Button>
                        </Popconfirm>
                        <Radio.Button value="small">Edit</Radio.Button>
                    </Radio.Group>
      }
    ];
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

   const fetchStudents = () => {
        getAllStudents()
               .then(res => res.json())
               .then( data => {
                 setStudents(data);
               })
               .catch(error => {
                   error.response.json().then( res => errorNotification("there was a issue", `${res.message} [statusCode:${res.status}]` ));
               }).finally(() => setFetching(false));
    }
   useEffect(() => {
       fetchStudents()
   }, []);


   const renderStudents = () => {
        if(fetching) {
            return <Spin indicator={antIcon} />;
        }
        if(students.length <= 0){
            return <>
                       <Button
                           onClick={() => setShowDrawer(!showDrawer)}
                           type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                           Add New Student
                       </Button>
                       <StudentDrawerForm
                           showDrawer={showDrawer}
                           setShowDrawer={setShowDrawer}
                           fetchStudents={fetchStudents}
                       />
                       <Empty/>
                   </>;
        }
        return <Table
            dataSource={students}
            columns={columns}
            bordered
            title={() =>
                <>
                <Tag style={{marginLeft: '10px'}}>Number of students</Tag>
                <Badge count={students.length} className="site-badge-count-4"/>
                <br/><br/>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="medium" >Add New Student</Button>
                </>
            }
            rowKey={(student) => student.id}/>
   }

    return (<>
    <StudentDrawerForm
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer} fetchStudents={fetchStudents} />
    <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                  Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                  Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                  <Menu.Item key="3">Tom</Menu.Item>
                  <Menu.Item key="4">Bill</Menu.Item>
                  <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="6">Team 1</Menu.Item>
                  <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                  Files
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }} />
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                  {
                    renderStudents()
                  }
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                <Image
                    width={75}
                    src="https://user-images.githubusercontent.com/4052589/117552882-fe437d80-b045-11eb-95e5-2b55c8efa153.png" />
                <Divider>
                    <a rel="noreferrer" target="_blank" href="https://amigoscode.com/p/full-stack-spring-boot-react" >
                    Click here to access Fullstack Spring Boot & React for professionals</a>
                </Divider>
              </Footer>
            </Layout>
          </Layout>
          </>);
}

export default App;
