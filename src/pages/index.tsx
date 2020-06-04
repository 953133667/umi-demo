import React, { PureComponent } from 'react'
import styles from './index.less';
import { Row, Col, Button, Popconfirm,Form,Input,Radio } from 'antd'
const { Search } = Input;

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

class List extends PureComponent {
  state = {
    baseList:[{
      "icon":"alipay",
      "id":"1",//唯一ID
      "name":"alipay",
      "description":"说明文字说明文字",
      "owner":"傅小小",
      "startTime":"2020-05-20",
      "progress":"35"
    },{
      "icon":"antd",
      "name":"antd",
      "id":"2",//唯一ID
      "description":"antd说明文字说明文字",
      "owner":"傅大大",
      "startTime":"2020-05-20",
      "progress":"85"
    },{
      "icon":"taobao",
      "name":"taobao",
      "id":"3",//唯一ID
      "description":"taobao说明文字说明文字",
      "owner":"傅小小",
      "startTime":"2020-05-20",
      "progress":"15"
    }],
    list: [{
      "icon":"alipay",
      "id":"1",//唯一ID
      "name":"alipay",
      "description":"说明文字说明文字",
      "owner":"傅小小",
      "startTime":"2020-05-20",
      "progress":"35"
    },{
      "icon":"antd",
      "name":"antd",
      "id":"2",//唯一ID
      "description":"antd说明文字说明文字",
      "owner":"傅大大",
      "startTime":"2020-05-20",
      "progress":"85"
    },{
      "icon":"taobao",
      "name":"taobao",
      "id":"3",//唯一ID
      "description":"taobao说明文字说明文字",
      "owner":"傅小小",
      "startTime":"2020-05-20",
      "progress":"15"
    }],
  };


  handleRefresh = newQuery => {
    // console.log("queryquery22");
    // console.log(newQuery);
    //根据状态过滤数据
    let newDataSource = this.state.list.filter((element)=>{
      return element.prostatus == newQuery.status;
    });

    //根据关键字过滤数据  关键字可能为空，要做一下判断
    if(newQuery.name){
      newDataSource = newDataSource.filter((element)=>{
        return element.name.indexOf(newQuery.name) !== -1;
      });
    }

    this.setState({
      list:newDataSource
    });

  }
  /**
   * 根据数据ID 删除对应数据
   * @param id
   */
  handleDeleteItemById = (id) => {

    //得到用户的 index
    let idIndex = this.findIndexById(id);
    //删除数据
    let listData = Object.assign([],this.state.list);
    listData.splice(idIndex, 1);


    this.setState({
      list:listData
    });
  }


  /**
   * 根据数据ID 更新对应数据
   * @param id
   */
  handleUpdateItemById = (id,newItem) => {
    console.log("更新");
    console.log(id);
    console.log(newItem);
    //得到用户的 index
    let idIndex = this.findIndexById(id);
    //修改数据
    let listData = Object.assign([],this.state.list);
    listData[idIndex]=newItem;

    this.setState({
      list:listData
    });


  }

  /**
   *  根据用户ID 查找这个用户 list的 index
   * @param id
   */
  findIndexById = (id)=>{
    let idIndex =  this.state.list.findIndex((element)=>{
      return element.id === id;
    });

    return idIndex;
  }


  get modalProps() {
    const { dispatch, user, loading, i18n } = this.props
    const { currentItem, modalVisible, modalType } = user

    return {
      i18n,
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`user/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`Create User` : i18n.t`编辑`
      }`,
      centered: true,
      onOk: data => {
        this.handleUpdateItemById(data.id,data);

        dispatch({
          type: 'user/hideModal',
        })

      },
      onCancel() {
        dispatch({
          type: 'user/hideModal',
        })
      },
    }
  }

  get listProps() {
    const { dispatch, user, loading } = this.props
    const { list, pagination, selectedRowKeys } = user





    return {
      dataSource: this.state.list,
      // dataSource: list,
      loading: loading.effects['user/query'],
      pagination,
      onChange: page => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem: id => {
        this.handleDeleteItemById(id);
      },
      onEditItem(item) {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'user/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location, dispatch, i18n } = this.props
    const { query } = location

    return {
      i18n,
      filter: {
        ...query,
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
  }

  handleFields = fields => {
    const { createTime } = fields
    if (createTime && createTime.length) {
      fields.createTime = [
        moment(createTime[0]).format('YYYY-MM-DD'),
        moment(createTime[1]).format('YYYY-MM-DD'),
      ]
    }
    return fields
  }

  handleSubmit = () => {
    const { onFilterChange } = this.props
    const values = this.formRef.current.getFieldsValue()
    const fields = this.handleFields(values)
    onFilterChange(fields)
  }

  handleReset = () => {
    const fields = this.formRef.current.getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    this.formRef.current.setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { onFilterChange } = this.props
    let fields = this.formRef.current.getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  handleStatusChange = (e) => {
    this.setState({
      prostatus: e.target.value,
    });
  }

  render() {
    const { user } = this.props
    const { selectedRowKeys } = user

    return (
      <div>
        <Form ref={this.formRef} name="control-ref" initialValues={{ name, address, createTime: initialCreateTime }}>
          <Row gutter={24}>

            <Col xl={{ span: 4 }} md={{ span: 8 }}>
              基本列表
            </Col>

            <Col
              {...TwoColProps}
              xl={{ span: 10 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
            >

            </Col>

            <Col
              {...TwoColProps}
              xl={{ span: 4 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
            >
              <Row type="flex" align="middle" justify="space-between">
                <div>
                  <Form.Item name="prostatus">
                    <Radio.Group value={this.state.prostatus} onChange={this.handleStatusChange}>
                      <Radio.Button value="0">全部</Radio.Button>
                      <Radio.Button value="1">进行中</Radio.Button>
                      <Radio.Button value="2">等待中</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Row>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              <Form.Item name="name">
                <Search
                  placeholder={`请输入`}
                  onSearch={this.handleSubmit}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={this.handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        <List {...this.listProps} />
      </div>
    )
  }
}

export default () => {

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
