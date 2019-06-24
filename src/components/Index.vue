<template>
    
    <div id="viewDiv">

        <UpdateFeature v-bind:showUpdate="showUpdate" @updateshowUpdate="updateshowUpdate" />
        <div class="notify"  @click="showModal">
            <span class="number-notify">{{NumberNotify}}</span>
            <i class="far fa-bell fa-2x"></i>
        </div>
        <mdb-modal fullHeight  position="right" direction="right" :show="modal" @close="modal = false">
            <mdb-modal-header>
                <mdb-modal-title style="text-align:center">THÔNG BÁO </mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body>
                <mdb-list-group>
                    <mdb-list-group-item  :action="true" class="flex-column align-items-start" v-for="(notify,index) in dataNotify" v-bind:key="index">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">{{notify.notification.title}}</h6>
                            <small>{{notify.data["gcm.notification.time"] }}</small>
                        </div>
                        <p> {{notify.notification.body}} </p>
                    </mdb-list-group-item>
                    <mdb-list-group-item  :action="true" class="flex-column align-items-start" v-if="NumberNotify == 0">
                        
                        <p> Không có thông báo! </p>
                    </mdb-list-group-item>
                </mdb-list-group>
            </mdb-modal-body>
            <mdb-modal-footer>
                <mdb-btn color="secondary" @click.native="modal = false">Close</mdb-btn>
            </mdb-modal-footer>
        </mdb-modal>
        
    </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {mapState} from 'vuex'
import UpdateFeature from './map/widget/UpdateFeature.vue'
import {mapActions} from 'vuex'
import { loadModules } from 'esri-loader'
import { getFeature, getLayer  } from '@esri/arcgis-rest-feature-layer';
import { mdbModal, mdbModalBody, mdbBtn, mdbListGroup, mdbListGroupItem ,
mdbModalHeader, mdbModalTitle, mdbModalFooter} from 'mdbvue';
import { async } from 'q';
import firebase from 'firebase'

export default {
    name: 'Map',
    data(){
        return{
            loadding: false,
            action: this.actionName,
            action: true,
            showUpdate: false,
            NumberNotify: 0,
            modal: false,
            dataNotify: []
           
        }
    },
    components:{
        UpdateFeature,
        mdbModal,
        mdbModalHeader,
        mdbModalTitle,
        mdbModalBody,
        mdbModalFooter,
        mdbBtn,
        mdbListGroup, 
        mdbListGroupItem
    },
    methods:{
        ...mapActions(['addFeature']),
       
        updateshowUpdate(val)
        {
            
            this.showUpdate = val
            // this.$store.state.view.ui.remove(widget)
        },
        updateaction(val)
        {
            this.$emit("updateaction",val)
            this.action = val
        },
        showModal(){
            var messaging = firebase.messaging()
            Notification.requestPermission().then(async (permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                this.modal = true      
            } else {
                console.log('Unable to get permission to notify.');
                this.checkmodal()
            }
            });  
        },
        checkmodal(){
             messaging.requestPermission()
        },
        LoadMap(){
            this.loadding = true
            loadModules([
                "esri/Map",
                "esri/views/MapView",
                "esri/layers/FeatureLayer",
                "esri/Graphic"
            ],{
             url: "https://js.arcgis.com/4.11/",
           
            }).then(([Map,MapView,FeatureLayer, Graphic]) => {
                if(!this.$store.state.map)
                {
                    const map = new Map({
                        basemap: "osm",
                        // layers: this.features.features
                    });
                    this.$store.state.map = map
                   
                }
               
                // console.log(this.$store.state.map)
                if(!this.$store.state.view)
                {
                    const view = new MapView({
                        container: "viewDiv",
                        map: this.$store.state.map,
                        center:   [106.366362, 10.360622],
                        zoom: 13
                    });
                    this.$store.state.view = view
                }
        
                const featureLayer = new FeatureLayer({
                    url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/CayXanh/FeatureServer/0",
                    
                    title: "Cây Xanh",
                    outFields: ["*"],
                    popupTemplate: {
                        title: "Cây {SoHieu} - {MaTenCX}",
                        content:  [
                                {
                                    type: "fields",
                                    fieldInfos: [
                                        {
                                        fieldName: "SoHieu",
                                        label: "Số Hiệu"
                                        },
                                        {
                                        fieldName: "MaTenCX",
                                        label: "MÃ CÂY XANH"
                                        },
                                         {
                                        fieldName: "KinhDo",
                                        label: "Kinh Độ"
                                        },
                                        {
                                        fieldName: "ViDo",
                                        label: "Vĩ Độ"
                                        },
                                        {
                                        fieldName: "DuongKinh",
                                        label: "Đường Kính"
                                        },
                                        {
                                        fieldName: "ChieuCao",
                                        label: "Chiều Cao"
                                        },
                                        {
                                        fieldName: "DoRongTan",
                                        label: "Độ Rộng Tán"
                                        },
                                        {
                                        fieldName: "NgayTrong",
                                        label: "Ngày Trồng"
                                        },
                                        {
                                        fieldName: "NgayCapNhat",
                                        label: "Ngày Cập Nhật"
                                        },
                                        {
                                        fieldName: "ThuocTinh",
                                        label: "Thuộc Tính"
                                        },
                                        {
                                        fieldName: "GhiChu",
                                        label: "Ghi Chú"
                                        },
                                        {
                                        fieldName: "MaTinhTrang",
                                        label: "Mã Tình Trạng"
                                        },
                                        {
                                        fieldName: "TuyenDuong",
                                        label: "Tuyến Đường"
                                        },
                                        {
                                        fieldName: "NVKS_X",
                                        label: "NVKS_X"
                                        },
                                        {
                                        fieldName: "NVKS_Y",
                                        label: "NVKS_Y"
                                        },
                                        
                                    ]
                                }
                            ],
                        actions: [{
                            id: "showImg",
                            title: "Xem hình ảnh",
                            className: "esri-icon-media"
                        }, {
                            id: "update-infor-tree",
                            title: "Cập nhật thông tin cây xanh",
                            className: "esri-icon-edit"
                        }, {
                            id: "edit",
                            title: "Tới trang chỉnh sửa",
                            className: "esri-icon-home"
                        }]
                    }
                });
                
                

                this.$store.state.map.add(featureLayer);
                this.$store.state.featureLayer = featureLayer
                // this.$store.state.view.ui.add("widget","top-right")
                // if(this.action != null)
                // {
                //         this.$store.state.view.ui.add("widget","top-right")
                // }
                
                const popup = this.$store.state.view.popup
                this.$store.state.view.popup.viewModel.on("trigger-action", async(event) => {
                   
                    const objecid = await event.target.selectedFeature.attributes.OBJECTID
                    const url = "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/CayXanh/FeatureServer/0"

                    getFeature({
                        url,
                        id: objecid
                        }).then(async (feature) => {
                        
                             this.$store.state.feature =  await feature
                             this.action = 'updateFeature'
                             this.showUpdate = true
                        
                        this.addFeature(feature)          
                        
                    });
                })
                console.log(this.update)
                console.log(this.$store.state.featureLayer)
               
            } )
        },
        Notify(){
            var messaging = firebase.messaging()
            messaging.onMessage( async (payload) => {
                this.dataNotify.push(payload)
                console.log("Notification received: ", payload)
                this.NumberNotify = this.NumberNotify + 1
                console.log(this.NumberNotify)
                toastr["info"](payload.notification.body, payload.notification.title);
            });
        }
    },
    created(){
        getLayer({
            url: this.$store.state.url
        })
        .then((response) => {
            // console.log(response)
        })
        this.LoadMap()
        this.Notify()
    },
    mounted(){
        this.Notify()
    }
   
}

</script>

<style>

#viewDiv {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
      padding-left:50px;
    }
.notify {position:fixed;bottom: 55px;right: 35px;color:#4285f4 ; padding: 15px;border:1px solid #4285f4;border-radius: 50%;
width: 70px;height: 70px;cursor: pointer;background:#fff;text-align: center}
.number-notify{    position: absolute;
    bottom: 10px;
    right: 10px;
    color: red;
    font-weight: 500;
    font-size: 16px;}
</style>
