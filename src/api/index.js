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
let Intranet = `http://39.99.173.172:8082/api`;
//let Intranet = `/api`;
const api = {
	url:"http://39.99.173.172:8082",
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
	getScrocesById(data) {
		return request({
			url: `${Intranet}/Personalscroce/GetById`,
			method: 'get',
			params: data
		})
	},
	deleteScroces(data) {
		return request({
			url: `${Intranet}/Personalscroce/Delete`,
			method: 'post',
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
	//成绩分析
	getPersonAnalysisInfo(data) {
		return request({
			url: `${Intranet}/personalAnalysis/GetPersonAnalysisInfo`,
			method: 'get',
			params: data
		})
	},
	//随机获取人员Personalfiles/GetRandomPersonalfile
	GetRandomPersonalfile(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetRandomPersonalfile`,
			method: 'get',
			params: data
		})
	},
	//排名
	GetLatesRank(data) {
		return request({
			url: `${Intranet}/personalAnalysis/GetLatesRank`,
			method: 'get',
			params: data
		})
	},
	//运动记录
	GetSportRecord(data) {
		return request({
			url: `${Intranet}/personalAnalysis/GetSportRecord`,
			method: 'get',
			params: data
		})
	},
	//单科成绩
	GetSubjectAchive(data) {
		return request({
			url: `${Intranet}/personalAnalysis/GetSubjectAchive`,
			method: 'get',
			params: data
		})
	},
	//部门列表
	GetDepartList(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetDepartList`,
			method: 'get',
			params: data
		})
	},
	//人员级别
	GetLevelByDepartment(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetLevelByDepartment`,
			method: 'get',
			params: data
		})
	},
	//部门综合指标
	GetDepartmentAnalysisInfo(data) {
		return request({
			url: `${Intranet}/departmentAnalysis/GetDepartmentAnalysisInfo`,
			method: 'get',
			params: data
		})
	},
	//科目人员分布
	GetSubjectDistribution(data) {
		return request({
			url: `${Intranet}/departmentAnalysis/GetSubjectDistribution`,
			method: 'get',
			params: data
		})
	},
	//最近一次科目平均成绩
	GetLatesSubjectScore(data) {
		return request({
			url: `${Intranet}/departmentAnalysis/GetLatesSubjectScore`,
			method: 'get',
			params: data
		})
	},
};
export default api;
