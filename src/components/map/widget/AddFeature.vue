<template>
<div>
  <mdb-modal removeBackdrop  :scrollable="scroll" fullHeight  position="right" direction="right" :show="showLocal" @close="closemodal">
    <mdb-modal-header>
        <mdb-modal-title>Thêm cây xanh mới</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body>
        <form v-on:submit.prevent="addFeature">
          
          <mdb-input v-model="feature.attributes.SoHieu" label="Số Hiệu" size="sm"  required />
          <select class="browser-default custom-select" v-model="feature.attributes.MaTenCX">
            <option v-for="(value, index) in ListTenCX" v-bind:key="index" v-bind:value="value[0]"> {{value[1]}} </option>
          </select>
          <select class="browser-default custom-select" v-model="feature.attributes.MaTrangThai" style="margin-top:15px;">
            <option v-for="(value, index) in ListTinhTrang" v-bind:key="index" v-bind:value="value[0]"> {{value[1]}} </option>
          </select>
          
          <mdb-input v-model="feature.attributes.KinhDo" label="Kinh Độ" size="sm" disabled />
          <mdb-input v-model="feature.attributes.ViDo" label="Vĩ Độ" size="sm" disabled />    
          <mdb-input v-model="feature.attributes.DuongKinh" label="Đường Kính" size="sm"  />    
          <mdb-input v-model="feature.attributes.ChieuCao" label="Chiều Cao" size="sm"  />    
          <mdb-input v-model="feature.attributes.DoRongTan" label="DoRongTan" size="sm"  />
          <input type="date" class="form-control" v-model="feature.attributes.NgayTrong" /> 
          <mdb-input v-model="feature.attributes.ThuocTinh" label="Thuộc Tính" size="sm"  />
          <mdb-input type="textarea" v-model="feature.attributes.GhiChu" label="Ghi Chú" size="sm"  />
            <!-- <mdb-input type="textarea" label="Material textarea" :rows="5"/> -->
          <button type="submit" class="btn btn-info">Thêm Cây Xanh Mới</button>
        </form>
      </mdb-modal-body>
      <mdb-modal-footer>
        <!-- <mdb-btn color="secondary" @click.native="showLocal = false">Close</mdb-btn>
        <mdb-btn color="primary" @click="resetFeature">Reset</mdb-btn> -->
      </mdb-modal-footer>
  </mdb-modal>
</div>

</template>
<script>
  import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn , mdbInput, mdbIcon,
  mdbListGroup, mdbListGroupItem, mdbBadge} from 'mdbvue'

  import { addFeatures } from '@esri/arcgis-rest-feature-layer'
  import { loadModules } from 'esri-loader'
  import axios from 'axios'
import { async } from 'q';
  export default {
    name: 'AddFeature',
    props: ["showadd"],
    watch:{
      showadd(newVal,oldVal){
        console.log(newVal)
        this.showLocal = newVal
      }
    },
    data(){
      return{
          feature:{
            geometry:{
                  x: 0,
                  y: 0,
                  spatialReference:  { 
                    wkid: 102100 
                  }
            },
            attributes: {
                  MaTenCX: 'BANG',
                  MaTrangThai: 1,
                  KinhDo: 0,
                  ViDo: 0,
                  NgayTrong: new Date()
            }
          },
          ListTenCX: [],
          ListTinhTrang: [],
          showLocal: false,
          scroll: true
        }
    },
    components: {
      mdbModal,
      mdbModalHeader,
      mdbModalTitle,
      mdbModalBody,
      mdbModalFooter,
      mdbBtn,
      mdbInput,
      mdbIcon,
      mdbListGroup, 
      mdbListGroupItem,
      mdbBadge
    },
    computed:
    {
       
    },
    created(){
      

    },
    methods:{
        
        getTenCX(){
          axios.get('http://127.0.0.1:8000/api/getListSpecies/',{
           
          }).then((response) => {
             this.ListTenCX  = response.data
          })
        },
        getTinhTrang(){
          axios.get('http://127.0.0.1:8000/api/getListStatus/',{
           
          }).then((response) => {
             this.ListTinhTrang  = response.data
             console.log(response.data)
          })
        },
        // saveLongLat(){
           
           
           
        // },
        addFeature(){
          addFeatures({
            url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/CayXanh/FeatureServer/0",
            features:[
              this.feature
            ]
          }).then((response) => {
            console.log(response)
          })
        },
        closemodal(){
          this.showLocal = false
          this.$emit("updateshowadd",false)
        }
    }
    ,
    mounted(){ 
     loadModules([
        "esri/Map",
        "esri/views/MapView",
      ]).then( async (Map, MapView) => {
        console.log('view',this.$store.state.view)
           this.$store.state.view.on("click",async(event) => {
              console.log(event);
              var lg =  await event.mapPoint.longitude
              var lt = await event.mapPoint.latitude
              var x = await event.mapPoint.x
              var y = await event.mapPoint.y
              var wkid = await event.mapPoint.spatialReference.wkid
              this.feature.geometry.x = x
              this.feature.geometry.y = y
              this.feature.geometry.spatialReference.wkid = wkid
              this.feature.attributes.KinhDo = lg
              this.feature.attributes.ViDo = lt
              
            })
      })
    },
    computed: {
    view () {
      return this.$store.state.view
    }
  }
  }
</script>