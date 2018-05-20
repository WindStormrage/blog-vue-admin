<style lang="stylus">
  #log
    .login
      display flex
      position fixed
      justify-content center
      flex-direction column
      align-items center
      height 100%
      width 100%
      background-size cover
      background #e7e7e7

    .login .header
      margin-top -100px
      margin-bottom 15px

    .login .logo
      margin-left -10px
      width 220px
      height:auto;

    .login .form
      display flex
      flex-direction column

    .login .form .username

      .ivu-input-large
        border 1px solid #7e7e7e
        border-radius 10px 10px 0 0
        border-bottom 0
        height 50px

      .ivu-icon
        margin-right 5px
        margin-top 8px
        font-size 30px

    .login .form .password
      .ivu-input-large
        border 1px solid #7e7e7e
        border-bottom 0
        height 50px
        border-radius 0 0 0 0

      .ivu-icon
        margin-right 5px
        margin-top 8px
        font-size 30px

    .login .form .code
      .ivu-input-large
        border 1px solid #7e7e7e
        border-radius 0 0 10px 10px
        height 50px

    .login .form .image
      position relative
      width 70px
      margin-left 220px
      margin-top -40px

    .login .button
      margin-top 30px

</style>

<template>
  <div id="log">
    <div class="login">
      <div class="header">
        <img class="logo" src="/static/img/ex_logo.png"/>
      </div>
      <div class="form">
        <Input class="username" v-model="form.username" icon="ios-person-outline" placeholder="请输入账号"
               style="width: 300px" size="large"/>
        <Input class="password" v-model="form.password" icon="ios-locked-outline" type="password" placeholder="请输入密码"
               style="width: 300px" size="large"/>
        <Input class="code" v-model="form.captcha_code" :maxlength="6" placeholder="请输入验证码" style="width: 300px"
               size="large"/>
        <img class="image" @click="refreshCode()" :src="vcode_src"/>
      </div>
      <div class="button">
        <Button type="primary" @click="login" :loading="isLoading" style="width: 300px;height:50px;font-size: 16px">登录
        </Button>
      </div>
    </div>
  </div>

</template>

<script>
  import formCheck from '../utils/form_check'
  import qs from 'qs'

  export default {
    created() {
      this.refreshCode()
    },
    data() {
      return {
        isLoading: false,
        vcode_src: '',
        username: '',
        form: {
          username: '',
          password: '',
          captcha_id: '',
          captcha_code: ''
        }
      }
    },
    methods: {
      login() {
        if (!formCheck(this.form)) {
          this.$Message.error('内容填写不完整')
          return
        }
        this.isLoading = true
        this.$http.post('/api/admin/login', qs.stringify(this.form)).then((response) => {
          this.isLoading = false
          let res = response.data
          this.refreshCode()
          this.form.captcha_code = ''
          if (res.status === 10401) {
            this.$Message.error('验证码错误，请重新填写')
          } else if (res.status === 10001) {
            this.$Message.error('账号或密码错误')
          } else if (res.status === 10000) {
            this.$Message.success('登录成功')
            this.$router.push({path: '/admin/main/article'})
          } else {
            this.$Message.error('登录错误，请稍候再试')
          }
        }).catch(() => {
          this.isLoading = false
          this.$Message.error('通讯失败，请重试')
        })
      },
      refreshCode() {
        this.$http.get('/api/common/captcha').then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.vcode_src = res.src
            this.form.captcha_id = res.id
          }
        }).catch(() => {
          this.$Message.error('验证码刷新失败')
        })
      }
    }
  }
</script>

