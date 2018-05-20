<style lang="stylus">
  #article
    .page
      display flex
      margin-top 10px
      justify-content flex-end
      flex-direction row

</style>
<template>
  <div id="article">
    <Table :columns="columns" :data="introductions" stripe></Table>
    <Button @click="$router.push({path: '/admin/main/person/save'})" type="primary" icon="plus"
            style="margin-top: 20px">添加人物
    </Button>
    <!--<save @refresh="listArticle()" ref="save"></save>-->
    <div class="page">
      <Page @on-page-size-change="sizeChange" @on-change="pageChange" :total="count" :page-size="query.per"
            show-sizer></Page>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import psave from './option/psave.vue'
  import pdetail from './option/pdetail.vue'

  export default {
    components: {
      psave,
      pdetail
    },
    data() {
      return {
        query: {
          language: '',
          page: 1,
          per: 10
        },
        count: 0,
        introductions: [],
        columns: [
          {
            title: 'ID',
            key: 'ID'
          },
          {
            title: '头像',
            key: 'Avatar',
            render: (h,params) =>{
              let a = params.row.Avatar;
              console.log(a);
              return h('img',{
                attrs:{
                  src:a,
                  style: "max-height: 80px;"
                }
              })
            }
          },
          {
            title: '名字',
            key: 'Name'
          },
          {
            title: '简介',
            key: 'Introduce'
          },
          {
            title: '内容',
            key: 'Contents',
            type: 'html'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/admin/main/person/detail?id=' + params.row.ID})
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/admin/main/person/save?id=' + params.row.ID})
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeArticle(params.row.ID)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.listArticle()
      })
    },
    methods: {
      changeLanguage(value) {
        this.query.language = value
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      sizeChange(size) {
        this.query.per = size
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      pageChange(page) {
        this.query.page = page
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      removeArticle(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除当前人物描述?',
          onOk: () => {
//            this.$ShowLoading()
            this.$http.post('/api/admin/person/delete', qs.stringify({
              id: id
            })).then((response) => {
              let res = response.data
              if (res.status === 10002) {
                this.$Message.error('删除失败')
                this.$router.push({path: '/admin/main/person'})
              } else if (res.status === 10001) {
                this.$Message.error('该人物描述未找到')
                this.$router.push({path: '/admin/main/person'})
              } else if (res.status === 10000) {
                this.$Message.success('删除成功')
                this.listArticle()
              }
//              this.$HideLoading()
            }).catch(() => {
//              this.$HideLoading()
              this.$Message.error('通讯失败，请重试')
            })
          }
        })
      },
      listArticle() {
//        this.$ShowLoading()
        this.$http.post('/api/admin/person/list', qs.stringify(
          this.query
        )).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.introductions = res.introductions
            this.query = {
              page: res.page,
              per: res.per
            }
            this.count = res.count
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
//          this.$HideLoading()
        }).catch(() => {
//          this.$HideLoading()
          this.$Message.error('通讯失败，请重试')
        })
      }
    }
  }
</script>
