<style lang="stylus">
  #main
    .main-layout
      border 1px solid #d7dde4
      background: #efefef

      .ivu-menu-horizontal
        height 80px

    .main-layout-logo
      width: 100px
      height: 60px
      border-radius: 3px
      float: left
      position: relative
      top: 10px
      left: 20px

    .main-layout-signOut
      display inline-block
      float right
      margin-right 50px
      margin-top 10px

    .main-layout-nav
      width: 420px
      margin: 0 auto

    .main-layout-assistant
      width: 300px
      margin: 0 auto
      height: inherit

    .main-layout-breadcrumb
      padding: 10px 15px 0

    .main-layout-content
      min-height: 500px
      margin: 20px
      overflow: hidden
      background: #fff
      border-radius: 4px

    .main-layout-content-main
      padding: 20px
      padding-bottom 100px

    .main-layout-copy
      text-align: center
      padding: 10px 0 20px
      color: #9ea7b4

  .ivu-menu-submenu-title
    display none

</style>

<template>
  <div id="main">
    <div class="main-layout">
      <Menu mode="horizontal" theme="light" active-name="1">
        <div class="main-layout-logo">
          <img src="/static/img/ex_logo.png" width="210px"/>
        </div>
        <div class="main-layout-nav">
        </div>
        <div class="main-layout-signOut">
          <Button type="primary" @click="logout">退出登录</Button>
        </div>
      </Menu>
      <div class="main-layout-content">
        <Row>
          <i-Col span="4">
            <Menu @on-select="menuSelect" active-name="active" :open-names="['1']" width="auto">
              <Submenu name="1">
                <template slot="title">
                  <Icon type="film-marker"></Icon>
                </template>
                <MenuItem name="1-1">文章管理</MenuItem>
                <MenuItem name="1-2">留言管理</MenuItem>
                <MenuItem name="1-3">随笔管理</MenuItem>
                <MenuItem name="1-4">配置管理</MenuItem>
                <MenuItem name="1-5">图片上传</MenuItem>
              </Submenu>
            </Menu>
          </i-Col>
          <i-col span="20">
            <div class="main-layout-content-main">
              <router-view></router-view>
            </div>
          </i-col>
        </Row>
      </div>
      <div class="main-layout-copy">
        2018 &copy; 谢大帅哥的个人博客后台管理系统
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        active: '1',
        nav: {
          '1-1': {
            path: '/admin/main/article',
            title: '文章管理'
          },
          '1-2': {
            path: '/admin/main/person',
            title: '留言管理'
          },
          '1-3': {
            path: '/admin/main/news',
            title: '随笔管理'
          },
          '1-4': {
            path: '/admin/main/config',
            title: '配置管理'
          },
          '1-5': {
            path: '/admin/main/upload',
            title: '图片上传'
          }
        }
      }
    },
    methods: {
      menuSelect(name) {
        this.$router.push({
          path: this.nav['' + name + ''].path
        })
        document.title = this.nav['' + name + ''].title
      },
      logout() {
        this.$http.post('/api/admin/logout').then((response) => {
          if (response.data.status === 10000) {
            this.$Message.success('退出成功')
            this.$router.push({path: '/admin'})
          } else {
            this.$Message.error('退出失败，请重试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      }
    }
  }
</script>
