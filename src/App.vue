<template>
  <div id='app'>
    <sidebar-menu :menu="menu"  @itemClick="onItemClick" />
    <AddFeature v-bind:showadd="showadd"  @updateshowadd="updateshowadd" />
    <Search v-bind:show="show" @updateshow="updateshow" @goto="goto" @resetFeature="resetFeature"/>
    <router-view></router-view>
  </div>
</template>

<script>
import AddFeature from '@/components/map/widget/AddFeature.vue'
import Search from '@/components/map/widget/Search.vue'
import firebase from 'firebase'
import { loadModules } from 'esri-loader'
import { async } from 'q';
export default {
    name: 'App',
    components:{
        AddFeature,
        Search
    },
    data(){
        return{
            menu:[
                {
                    href: '/',
                    title: 'Trang Chủ',
                    icon: 'fa fa-home'
                },
                {
                    title: 'Quản Lý Cây Xanh',
                    icon: 'fa fa-pen',
                    nameEvent: 'NULL',
                    child:[
                        {
                            title: 'Thêm mới',
                            nameEvent: 'addFeature'
                        },

                    ]
                },
                {
                    title: 'Tìm Kiếm',
                    icon: 'fa fa-search',
                    nameEvent: 'Search'
                    
                }
            ],
            actionName: '',
            showadd: false,
            show:false
        }
    },
    methods:{
        updateshowadd(val){
            this.showadd = val
            // this.$emit("updateaction",null)
        },
        updateshow(){
            this.show = false
        },
                goto(val){
            console.log('goto', val)
            // this.$store.state.map.highlight([val.attributes.objectId]);     
            this.$store.state.view.goTo({
                target: val.geometry,
               
                zoom: 200,
                highlightOptions: {
                    color: [255, 255, 0, 1],
                    haloOpacity: 0.5,
                    fillOpacity: 0.5
                }
            })
            const popupTemplate = this.$store.state.popup
            this.$store.state.view.popup.open({

                location: val.geometry,
                features: val,
                outFields: ["*"],
                title: "Cây "+val.attributes.SoHieu+" - "+val.attributes.MaTenCX+"",
                content:"<table class='esri-widget__table'> " +
                "<tr><th>Số Hiệu </th><td>" + val.attributes.SoHieu + "</td></tr> " +
                "<tr><th>Tên Cây Xanh</th><td>" + val.attributes.MaTenCX + "</td></tr> " +
                "<tr><th>Kinh độ </th><td>" + (val.attributes.KinhDo != null ? parseFloat(val.attributes.KinhDo) : '(Rỗng)') + "</td></tr> " +
                "<tr><th>Vĩ độ </th><td>" + (val.attributes.ViDo != null ? parseFloat(val.attributes.ViDo) : '(Rỗng)') + "</td></tr> " +
                "<tr><th>Đường Kính </th><td>" + parseFloat(val.attributes.DuongKinh) + "</td></tr> " +
                "<tr><th>Chiều Cao </th><td>" + parseFloat(val.attributes.ChieuCao) + "</td></tr> " +
                "<tr><th>Độ Rộng Tán </th><td>" + parseFloat(val.attributes.DoRongTan != null ? val.attributes.DoRongTan : '(Rỗng)') + "</td></tr> " +
                "<tr><th>Ngày Trồng </th><td>" + (val.attributes.NgayTrong != null ? val.attributes.NgayTrong : '(rỗng)') + "</td></tr> " +
                "<tr><th>Ngày Cập Nhật </th><td>" + val.attributes.NgayCapNhat + "</td></tr> " +
                "<tr><th>Thuộc Tính </th><td>" + (val.attributes.ThuocTinh != null ? val.attributes.ThuocTinh : '(rỗng)') + "</td></tr> " +
                "<tr><th>Ghi Chú </th><td>" + val.attributes.GhiChu + "</td></tr> " +
                "<tr><th>Tuyến Đường </th><td>" + val.attributes.TuyenDuong + "</td></tr> " +
                "<tr><th>NVKS_X </th><td>" + (val.attributes.NVKS_X != null ? val.attributes.NVKS_X : '(rỗng)') + "</td></tr> " +
                "<tr><th>NVKS_Y </th><td>" + (val.attributes.NVKS_Y != null ? val.attributes.NVKS_Y : '(rỗng)') + "</td></tr> " +
                "<tr><th>Người Cập Nhật </th><td>" + (val.attributes.NguoiCapNhat != null ? val.attributes.NguoiCapNhat : '(rỗng)') + "</td></tr> " +
                "</table> ",
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
            })
        },
        resetFeature(){
            this.loadding = true
            loadModules([
                "esri/layers/FeatureLayer",
            ],{
                url: "https://js.arcgis.com/4.11/",
            }).then( async([FeatureLayer])=>{
                const featureLayer = new FeatureLayer(this.$store.state.init_featurelayer)
                this.$store.state.featureLayer = featureLayer
                await this.$store.state.map.add(featureLayer)
                this.loadding = false
            })
            
        },
        onItemClick(event, item) {
            this.actionName = item.nameEvent
            console.log(item.nameEvent)
            if(item.nameEvent == 'addFeature')
            {
                this.showadd = true
            }
            else if(item.nameEvent == 'Search'){
                this.show = true
            }
            // this.$store.state.action = item.nameEvent     
        },
        upadteaction(val){
            this.actionName = val
        }
        
    },
    mounted(){
        // console.log(this.action);
       
    },
    created(){
        const messaging = firebase.messaging()
        // messaging.usePublicVapidKey('AAAAzj05RmE:APA91bFM0Htyxso9V6P0PquLcvF7dK_HaW-_1ruDf-YBgL3OuTchBggYBM_iYRRzNf-C4bwHyX1JsisqZgWsDqLqK70WvDYoYsCFn5IGzfPsjgXin3v54vR9l--WDkZCifPnoMsHlD-Q')
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                // TODO(developer): Retrieve an Instance ID token for use with FCM.
                // ...
            } else {
                console.log('Unable to get permission to notify.');
            }
            });

        messaging.requestPermission()
        messaging.getToken().then((currentToken) => {
        if (currentToken) {
            console.log(currentToken)
            // sendTokenToServer(currentToken);
            // updateUIForPushEnabled(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
        }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
        setTokenSentToServer(false);
        });
        
    },
    
}
</script>
