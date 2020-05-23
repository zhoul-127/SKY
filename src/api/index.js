/*
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-26 17:56:12
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 10:28:33
 */
import axios from 'axios'
import router from '@/router'
import Vue from 'vue'
// 配置根域名
axios.defaults.headers.post['Content-Type'] = 'application/json,charset=utf-8'

import {
	Message,
	MessageBox
} from 'element-ui'
import request from '@/axios/request'
//let Intranet = `http://39.99.173.172:8082/api`;
let Intranet = `/api`;
const api = {
	getToken(data) {
		return request({
			url: `${Intranet}/sso/GetToken`,
			method: 'get',
			params: data
		})
	},
	getUserInfo(data) {
		return request({
			url: `${Intranet}/sso/GetUserInfoByToken`,
			method: 'get',
			params: data
		})
	},
	userList(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetPersonalList`,
			method: 'get',
			params: data
		})
	},
	getUserId(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetById`,
			method: 'get',
			params: data
		})
	},
	saveUser(data) {
		return request({
			url: `${Intranet}/Personalfiles/Save`,
			method: 'post',
			params: data
		})
	},
	deleteUser(data) {
		return request({
			url: `${Intranet}/Personalfiles/Delete`,
			method: 'post',
			params: data
		})
	},
	getSubject(data) {
		return request({
			url: `${Intranet}/dicsubject/GetAll`,
			method: 'get',
			params: data
		})
	},
	getSubjectType(data) {
		return request({
			url: `${Intranet}/dicsubject/GetDicSubject`,
			method: 'get',
			params: data
		})
	},
	saveSource(data) {
		return request({
			url: `${Intranet}/Personalscroce/Save`,
			method: 'post',
			params: data
		})
	},
	getScroces(data) {
		return request({
			url: `${Intranet}/Personalscroce/GetScroces`,
			method: 'get',
			params: data
		})
	},
	getPageScroces(data) {
		return request({
			url: `${Intranet}/Personalscroce/GetPageScroces`,
			method: 'get',
			params: data
		})
	},
	getLatesd(data) {
		return request({
			url: `${Intranet}/Personalscroce/GetLatestAchiveDate`,
			method: 'get',
			params: data
		})
	},
	importSource(){
		return request({
			url: `${Intranet}/Personalfiles/ImportPersonalfileExcel`,
			method: 'post',
			params: data
		})
	},

};
export default api;
