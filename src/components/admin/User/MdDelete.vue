<template>
  <div>
    <!-- Frame Modal Bottom -->
   
    <mdb-modal removeBackdrop frame position="top" direction="bottom" :show="show">
        <mdb-modal-body class="text-center" v-if="userLocal != null">
            <span>Bạn thật sự có muốn xóa thành viên {{userLocal.name}} :( ?</span>
            <mdb-btn color="secondary" v-on:click="closemodal">No</mdb-btn>
            <mdb-btn color="primary">Yes</mdb-btn>
        </mdb-modal-body>
    </mdb-modal>
  </div>
</template>
<script>
  import { mdbModal, mdbModalBody, mdbBtn } from 'mdbvue';
  export default {
    components: {
      mdbModal,
      mdbModalBody,
      mdbBtn
    },
    props:{
        dlete:{
            type: Boolean,
            required: true
        },
        user:{
            type:Object,
            required: true
        }
    },
    watch:{
        dlete(newVal,oldVal)
        {
            this.show = newVal
        },
        user(newVal,oldVal)
        {
            this.userLocal = newVal
        }
    },
    methods:{
        closemodal(){
            this.show = false
            this.$emit("deleted",false)
        }
    },
    data() {
      return {
        modal: false,
        show: false,
        userLocal: null
      };
    }
  };
</script>