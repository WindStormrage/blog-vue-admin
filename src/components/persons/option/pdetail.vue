<style lang="stylus">
  #detail
    .ivu-form-item-label
      font-size 13px
      font-weight 800

</style>

<template>
  <div id="detail">
    <Form :model="form" :label-width="80">
      <FormItem label="ID:">
        {{form.id}}
      </FormItem>
      <FormItem label="头像:">
        <img :src="form.avatar" style="max-height: 240px">
      </FormItem>
      <FormItem label="名字:">
        {{form.name}}
      </FormItem>
      <FormItem label="简介:">
        {{form.introduce}}
      </FormItem>
      <FormItem label="内容:">
        <div v-html="form.contents"></div>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        getID: '',
        form: {
          id: 0,
          avatar: '',
          name: '',
          introduce: '',
          contents: ''
        },
        isLoading: false,
        visible: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        }
      }
    },
    created() {
      this.getID = this.$route.query.id
      if (this.getID !== undefined) {
        this.getDetail()
      }
    },
    methods: {
      getDetail() {
        this.$http.post('/api/admin/person/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              id: res.introduction.ID,
              avatar: res.introduction.Avatar,
              name: res.introduction.Name,
              contents: res.introduction.Contents,
              introduce: res.introduction.Introduce
            }
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      }
    }
  }
</script>

