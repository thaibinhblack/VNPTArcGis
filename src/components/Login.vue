<template>

    <mdb-card class="col-md-4" style="margin:auto;margin-top:50px;">

        <mdb-card-body class="mx-4">
            <div class="text-center">
                <h3 class="dark-grey-text mb-5"><strong>VNPT Cây Xanh</strong></h3>
            </div>
            <mdb-input v-if="showphone == false" label="Your email" type ="email" v-model="username"/>
            <mdb-input v-if="showphone == false" label="Your password" type="password" v-model="password" containerClass="mb-0"/>
            <mdb-input v-if="showphone == true" label="Your Phone" type ="number" v-model="phone"/>
            <mdb-input v-if="showotp == true" label="Your Phone" type ="number" v-model="otp"/>
            <div id="recaptcha-container"></div>
            <div class="text-center mb-3">
                <mdb-btn v-if="showphone == false"  type="button" gradient="blue" rounded class="btn-block z-depth-1a" @click="login">Đăng Nhập</mdb-btn>
                <mdb-btn  id="sign-in-button" type="button" gradient="blue" rounded class="btn-block z-depth-1a" @click="sendOtp">Xác Thực</mdb-btn>
                <mdb-btn v-if="showotp == true"  type="button" gradient="blue" rounded class="btn-block z-depth-1a" @click="verifyOtp">Xác Thự OTPc</mdb-btn>
            </div>
            <p class="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2"> or Sign in with:</p>
            <div class="row my-3 d-flex justify-content-center">
                <!-- <mdb-btn type="button" color="white" rounded class="mr-md-3 z-depth-1a"><mdb-icon fab icon="facebook" class="blue-text text-center"/></mdb-btn>
                <mdb-btn type="button" color="white" rounded class="mr-md-3 z-depth-1a"><mdb-icon fab icon="twitter" class="blue-text"/></mdb-btn> -->
                <mdb-btn type="button" color="white" rounded class="z-depth-1a"><mdb-icon fab icon="google-plus" class="blue-text"/></mdb-btn>
            </div>
        </mdb-card-body>
        <mdb-modal-footer class="mx-5 pt-3 mb-1">
            <p class="font-small grey-text d-flex justify-content-end">Bạn đã quên mật khẩu? <a href="#" class="blue-text ml-1" @click="signinphone"> xác thực qua điện thoại</a></p>
        </mdb-modal-footer>
    </mdb-card>
</template>
<script>
    import firebase from 'firebase'
    import {mdbInput, mdbBtn, mdbCard, mdbCardBody, mdbModalFooter, mdbIcon } from 'mdbvue';
    import axios from 'axios'
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    // import bcrypt from 'bcrypt'
    export default {
        name: 'Login',
        components: {
            mdbInput,
            mdbBtn,
            mdbCard,
            mdbCardBody,
            mdbModalFooter,
            mdbIcon,
        },
        data() {
            return {
                username: null,
                password: null,
                showphone: false,
                showotp: false,
                phone: null,
                appVerifier : '',
                otp : ''
            };
        },
        methods: {
            login(){
                console.log('user',this.username,'password',this.password)
                axios.post("https://dtvithanh.vbgis.vn/api/login",
                {
                    username:  this.username,
                    password: this.password
                },
                {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                
                ).then((response) => {
                       console.log(response) 
                }).catch((error) => {
                    console.log(error)
                })
               
                
            },
            signinphone(){
              this.showphone = true
            },
            sendOtp(){
              if(this.phone.length >= 12){
                alert(this.phone.length);
              }
              else{
                //
                let countryCode = '+84' //VN
                let phoneNumber = countryCode + this.phone
                //
                let appVerifier = this.appVerifier
                //
                 this.showotp = true
                firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                  .then(function (confirmationResult) {
                    window.confirmationResult = confirmationResult;
                   
                    console.log('SMS sent')
                  }).catch(function (error) {
                      console.log('Error ! SMS not sent',error)
                    //  this.showotp = false
                });
              }
            },
      //
            verifyOtp(){
              if(this.phone.length >= 10 || this.otp.length != 6){
                alert('Invalid Phone Number/OTP Format !');
              }else{
                //
                let vm = this
                let code = this.otp
                //
                window.confirmationResult.confirm(code).then(function (result) {
                  
                  var user = result.user;
                console.log(user);
                  vm.$router.push({path:'/setPassword'})
                }).catch(function (error) {
                  // User couldn't sign in (bad verification code?)
                  // ...
                });
              }
            },
            initReCaptcha(){
              setTimeout(()=>{
                let vm = this
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                  'size': 'invisible',
                  'callback': function(response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                  },
                  'expired-callback': function() {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // ...
                  }
                });
                //
                this.appVerifier =  window.recaptchaVerifier
              },1000)
            }
        },
        created(){
          this.initReCaptcha()
        }
    }
</script>
<style scoped>
    .font-small {
        font-size: 0.8rem;
    }
</style>