<template>
    <div id="app">
        <sidebar-menu :menu="menu"  @itemClick="onItemClick" />
        <dashboard />
        <router-view/>
    </div>
</template>

<script>
import Dashboard from './Dashboard.vue'
import Users from './User.vue'
export default {
  name: 'Admin',
  data () {
    return {
      menu: [
        {
          href: '/',
          title: 'Trang Chủ',
          icon: 'fa fa-home'
        },
        {
          href:'admin/user',
          title: 'Nhân Viên',
          icon: 'fa fa-user',
          nameEvent: 'NULL',
          child: [
            {
              title: 'Tất Cả Nhân Viên',
              nameEvent: 'allNV'
            },
            {
              title: 'Lịch Thi Công',
              nameEvent: 'addNV'
            }

          ]
        },
        {
          title: 'Tìm Kiếm',
          icon: 'fa fa-search',
          nameEvent: 'Search'

        }
      ],
      actionName: ''

    }
  },
  components: {
    Dashboard,
    Users

  },
  methods: {

    onItemClick (event, item) {
      this.actionName = item.nameEvent
      // this.$store.state.action = item.nameEvent
      // console.log(item.nameEvent)
    },
    upadteaction (val) {
      this.actionName = val
    }

  },
  mounted () {
    // console.log(this.action);

  },
  created () {

  }
}
</script>

<style>
    .v-sidebar-menu.vsm-default {width:250px !important;}
</style>
