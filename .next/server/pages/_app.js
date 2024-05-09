"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/AuthContext.tsx":
/*!**************************************!*\
  !*** ./src/contexts/AuthContext.tsx ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthContext: () => (/* binding */ AuthContext),\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _services_apiClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/services/apiClient */ \"./src/services/apiClient.ts\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_services_apiClient__WEBPACK_IMPORTED_MODULE_2__]);\n_services_apiClient__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nlet authChannel;\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();\n    const isAuthenticated = !!user;\n    async function signIn({ email, password, showToast }) {\n        try {\n            const response = await _services_apiClient__WEBPACK_IMPORTED_MODULE_2__.api.post(\"sessions\", {\n                email,\n                password\n            });\n            const { name, identifier, telephone, is_employee, functionn, isAdmin } = response.data.user;\n            const { token, refreshToken } = response.data;\n            (0,nookies__WEBPACK_IMPORTED_MODULE_3__.setCookie)(undefined, \"baseApp.token\", token, {\n                maxAge: 60 * 60 * 1 * 1,\n                path: \"/\"\n            });\n            (0,nookies__WEBPACK_IMPORTED_MODULE_3__.setCookie)(undefined, \"baseApp.refreshToken\", refreshToken, {\n                maxAge: 60 * 60 * 1 * 1,\n                path: \"/\"\n            });\n            setUser({\n                name,\n                identifier,\n                telephone,\n                is_employee,\n                functionn,\n                email,\n                isAdmin\n            });\n            _services_apiClient__WEBPACK_IMPORTED_MODULE_2__.api.defaults.headers[\"Authorization\"] = `Bearer ${token}`;\n            next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/dashboard\");\n        } catch (error) {\n            showToast({\n                description: error.response.data.message,\n                status: \"error\"\n            });\n        }\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            signIn,\n            user,\n            isAuthenticated\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/basis-luiz/Documentos/GoodWork_front-end/src/contexts/AuthContext.tsx\",\n        lineNumber: 80,\n        columnNumber: 9\n    }, this);\n}\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvQXV0aENvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRTtBQUUzQjtBQUNQO0FBQ0g7QUE0QmpDLE1BQU1LLDRCQUFjTCxvREFBYUEsQ0FBQyxDQUFDO0FBRW5DLElBQUlNO0FBRUosU0FBU0MsYUFBYSxFQUFFQyxRQUFRLEVBQXNCO0lBQ2xELE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHVCwrQ0FBUUE7SUFDaEMsTUFBTVUsa0JBQWtCLENBQUMsQ0FBQ0Y7SUFFMUIsZUFBZUcsT0FBTyxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsRUFBRUMsU0FBUyxFQUFzQjtRQUNwRSxJQUFHO1lBQ0MsTUFBT0MsV0FBVyxNQUFNZCxvREFBR0EsQ0FBQ2UsSUFBSSxDQUFDLFlBQVk7Z0JBQUVKO2dCQUFPQztZQUFTO1lBRS9ELE1BQU0sRUFBRUksSUFBSSxFQUFFQyxVQUFVLEVBQUVDLFNBQVMsRUFBRUMsV0FBVyxFQUFFQyxTQUFTLEVBQUVDLE9BQU8sRUFBRSxHQUFHUCxTQUFTUSxJQUFJLENBQUNmLElBQUk7WUFFM0YsTUFBTSxFQUFFZ0IsS0FBSyxFQUFFQyxZQUFZLEVBQUUsR0FBR1YsU0FBU1EsSUFBSTtZQUU3Q3JCLGtEQUFTQSxDQUFDd0IsV0FBVyxpQkFBaUJGLE9BQU87Z0JBQ3pDRyxRQUFRLEtBQUssS0FBSyxJQUFJO2dCQUN0QkMsTUFBTTtZQUNWO1lBQ0ExQixrREFBU0EsQ0FBQ3dCLFdBQVcsd0JBQXdCRCxjQUFjO2dCQUN2REUsUUFBUSxLQUFLLEtBQUssSUFBSTtnQkFDdEJDLE1BQU07WUFDVjtZQUVBbkIsUUFBUTtnQkFDSlE7Z0JBQ0FDO2dCQUNBQztnQkFDQUM7Z0JBQ0FDO2dCQUNBVDtnQkFDQVU7WUFDSjtZQUVBckIsb0RBQUdBLENBQUM0QixRQUFRLENBQUNDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sRUFBRU4sTUFBTSxDQUFDO1lBRXpEckIsdURBQVcsQ0FBQztRQUVoQixFQUFDLE9BQU02QixPQUFNO1lBQ1RsQixVQUFVO2dCQUNObUIsYUFBYUQsTUFBTWpCLFFBQVEsQ0FBQ1EsSUFBSSxDQUFDVyxPQUFPO2dCQUN4Q0MsUUFBUTtZQUNaO1FBQ0o7SUFDSjtJQUNBLHFCQUNJLDhEQUFDL0IsWUFBWWdDLFFBQVE7UUFBQ0MsT0FBTztZQUFFMUI7WUFBUUg7WUFBTUU7UUFBZ0I7a0JBQzFESDs7Ozs7O0FBSVg7QUFFc0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90Y2MvLi9zcmMvY29udGV4dHMvQXV0aENvbnRleHQudHN4PzFmYTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVhY3ROb2RlLCBjcmVhdGVDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBJU2hvd1RvYXN0IH0gZnJvbSBcIkAvdXRpbHMvSVNob3dUb2FzdFwiO1xuaW1wb3J0IHsgYXBpIH0gZnJvbSBcIkAvc2VydmljZXMvYXBpQ2xpZW50XCI7XG5pbXBvcnQgeyBzZXRDb29raWUgfSBmcm9tIFwibm9va2llc1wiO1xuaW1wb3J0IFJvdXRlciBmcm9tIFwibmV4dC9yb3V0ZXJcIjtcblxuaW50ZXJmYWNlIElTaWduSW5DcmVkZW50aWFscyB7XG4gICAgZW1haWw6IHN0cmluZztcbiAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgIHNob3dUb2FzdDogKGluZm9Ub2FzOiBJU2hvd1RvYXN0KSA9PiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgSVVzZXIge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gICAgdGVsZXBob25lOiBzdHJpbmc7XG4gICAgaXNfZW1wbG95ZWU6IHN0cmluZ1xuICAgIGZ1bmN0aW9ubjogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgaXNBZG1pbjogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIElBdXRoQ29udGV4dERhdGEge1xuICAgIHNpZ25JbihjcmVkZW50aWFsczogSVNpZ25JbkNyZWRlbnRpYWxzKTogUHJvbWlzZTx2b2lkPjtcbiAgICB1c2VyOiBJVXNlcjtcbiAgICBpc0F1dGhlbnRpY2F0ZWQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBJQXV0aFByb3ZpZGVyUHJvcHMge1xuICAgIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG59XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCh7fSBhcyBJQXV0aENvbnRleHREYXRhKTtcblxubGV0IGF1dGhDaGFubmVsOiBCcm9hZGNhc3RDaGFubmVsO1xuXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiBJQXV0aFByb3ZpZGVyUHJvcHMpe1xuICAgIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPElVc2VyPigpO1xuICAgIGNvbnN0IGlzQXV0aGVudGljYXRlZCA9ICEhdXNlcjtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHNpZ25Jbih7IGVtYWlsLCBwYXNzd29yZCwgc2hvd1RvYXN0IH06IElTaWduSW5DcmVkZW50aWFscyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCAgcmVzcG9uc2UgPSBhd2FpdCBhcGkucG9zdChcInNlc3Npb25zXCIsIHsgZW1haWwsIHBhc3N3b3JkIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB7IG5hbWUsIGlkZW50aWZpZXIsIHRlbGVwaG9uZSwgaXNfZW1wbG95ZWUsIGZ1bmN0aW9ubiwgaXNBZG1pbiB9ID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuXG4gICAgICAgICAgICBjb25zdCB7IHRva2VuLCByZWZyZXNoVG9rZW4gfSA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgIHNldENvb2tpZSh1bmRlZmluZWQsIFwiYmFzZUFwcC50b2tlblwiLCB0b2tlbiwge1xuICAgICAgICAgICAgICAgIG1heEFnZTogNjAgKiA2MCAqIDEgKiAxLCAvLyAzMCBkYXlzXG4gICAgICAgICAgICAgICAgcGF0aDogXCIvXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNldENvb2tpZSh1bmRlZmluZWQsIFwiYmFzZUFwcC5yZWZyZXNoVG9rZW5cIiwgcmVmcmVzaFRva2VuLCB7XG4gICAgICAgICAgICAgICAgbWF4QWdlOiA2MCAqIDYwICogMSAqIDEsIC8vIDMwIGRheXNcbiAgICAgICAgICAgICAgICBwYXRoOiBcIi9cIixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZXRVc2VyKHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgdGVsZXBob25lLFxuICAgICAgICAgICAgICAgIGlzX2VtcGxveWVlLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9ubixcbiAgICAgICAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICAgICAgICBpc0FkbWluXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXBpLmRlZmF1bHRzLmhlYWRlcnNbXCJBdXRob3JpemF0aW9uXCJdID0gYEJlYXJlciAke3Rva2VufWA7XG5cbiAgICAgICAgICAgIFJvdXRlci5wdXNoKFwiL2Rhc2hib2FyZFwiKTtcblxuICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyb3IucmVzcG9uc2UuZGF0YS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogXCJlcnJvclwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgc2lnbkluLCB1c2VyLCBpc0F1dGhlbnRpY2F0ZWQgfX0+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxuICAgICk7XG5cbn1cblxuZXhwb3J0IHsgQXV0aFByb3ZpZGVyICwgQXV0aENvbnRleHQgfTsiXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZVN0YXRlIiwiYXBpIiwic2V0Q29va2llIiwiUm91dGVyIiwiQXV0aENvbnRleHQiLCJhdXRoQ2hhbm5lbCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJpc0F1dGhlbnRpY2F0ZWQiLCJzaWduSW4iLCJlbWFpbCIsInBhc3N3b3JkIiwic2hvd1RvYXN0IiwicmVzcG9uc2UiLCJwb3N0IiwibmFtZSIsImlkZW50aWZpZXIiLCJ0ZWxlcGhvbmUiLCJpc19lbXBsb3llZSIsImZ1bmN0aW9ubiIsImlzQWRtaW4iLCJkYXRhIiwidG9rZW4iLCJyZWZyZXNoVG9rZW4iLCJ1bmRlZmluZWQiLCJtYXhBZ2UiLCJwYXRoIiwiZGVmYXVsdHMiLCJoZWFkZXJzIiwicHVzaCIsImVycm9yIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlIiwic3RhdHVzIiwiUHJvdmlkZXIiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-query */ \"react-query\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/styles/theme */ \"./src/styles/theme.ts\");\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./src/contexts/AuthContext.tsx\");\n/* harmony import */ var _services_queryClient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/services/queryClient */ \"./src/services/queryClient.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__, _styles_theme__WEBPACK_IMPORTED_MODULE_3__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__]);\n([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__, _styles_theme__WEBPACK_IMPORTED_MODULE_3__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n        client: _services_queryClient__WEBPACK_IMPORTED_MODULE_5__.queryClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__.AuthProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ChakraProvider, {\n                theme: _styles_theme__WEBPACK_IMPORTED_MODULE_3__.theme,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/basis-luiz/Documentos/GoodWork_front-end/src/pages/_app.tsx\",\n                    lineNumber: 14,\n                    columnNumber: 21\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/basis-luiz/Documentos/GoodWork_front-end/src/pages/_app.tsx\",\n                lineNumber: 13,\n                columnNumber: 17\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/basis-luiz/Documentos/GoodWork_front-end/src/pages/_app.tsx\",\n            lineNumber: 12,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/basis-luiz/Documentos/GoodWork_front-end/src/pages/_app.tsx\",\n        lineNumber: 11,\n        columnNumber: 9\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNrRDtBQUNBO0FBQ1g7QUFDZ0I7QUFDRjtBQUVyRCxTQUFTSyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBRTdDLHFCQUNJLDhEQUFDTiw0REFBbUJBO1FBQUNPLFFBQVFKLDhEQUFXQTtrQkFDcEMsNEVBQUNELCtEQUFZQTtzQkFDVCw0RUFBQ0gsNERBQWNBO2dCQUFDRSxPQUFPQSxnREFBS0E7MEJBQ3hCLDRFQUFDSTtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLNUM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RjYy8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgeyBDaGFrcmFQcm92aWRlciB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XG5pbXBvcnQgeyBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXF1ZXJ5XCI7XG5pbXBvcnQgeyB0aGVtZSB9IGZyb20gXCJAL3N0eWxlcy90aGVtZVwiO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSBcIi4uL2NvbnRleHRzL0F1dGhDb250ZXh0XCI7XG5pbXBvcnQgeyBxdWVyeUNsaWVudCB9IGZyb20gXCJAL3NlcnZpY2VzL3F1ZXJ5Q2xpZW50XCI7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpe1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICAgICAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgICAgICAgICAgIDxDaGFrcmFQcm92aWRlciB0aGVtZT17dGhlbWV9PlxuICAgICAgICAgICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9Lz5cbiAgICAgICAgICAgICAgICA8L0NoYWtyYVByb3ZpZGVyPlxuICAgICAgICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwIl0sIm5hbWVzIjpbIkNoYWtyYVByb3ZpZGVyIiwiUXVlcnlDbGllbnRQcm92aWRlciIsInRoZW1lIiwiQXV0aFByb3ZpZGVyIiwicXVlcnlDbGllbnQiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImNsaWVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/services/api.ts":
/*!*****************************!*\
  !*** ./src/services/api.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupAPIClient: () => (/* binding */ setupAPIClient)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_1__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);\naxios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nlet isRefreshing = false;\nlet failedRequestsQueue = [];\nfunction setupAPIClient(ctx = undefined) {\n    let cookies = (0,nookies__WEBPACK_IMPORTED_MODULE_1__.parseCookies)(ctx);\n    const api = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n        baseURL: \"http://localhost:3333\",\n        headers: {\n            Authorization: `Bearer ${cookies[\"token.token\"]}`\n        }\n    });\n    api.interceptors.response.use((response)=>response, (error)=>{\n        if (error.response?.status === 401) {\n            if (error.response.data === \"Token inv\\xe1lido\") {\n                cookies = (0,nookies__WEBPACK_IMPORTED_MODULE_1__.parseCookies)(ctx);\n                const { \"token.refreshToken\": refreshToken } = cookies;\n                const originalConfig = error.config;\n                if (!isRefreshing) {\n                    isRefreshing = true;\n                    api.post(\"refresh-token\", {\n                        token: refreshToken\n                    }).then((response)=>{\n                        const { token, refreshToken } = response.data;\n                        (0,nookies__WEBPACK_IMPORTED_MODULE_1__.setCookie)(ctx, \"token.token\", token, {\n                            maxAge: 60 * 60 * 24 * 1,\n                            path: \"/\"\n                        });\n                        (0,nookies__WEBPACK_IMPORTED_MODULE_1__.setCookie)(ctx, \"token.refreshToken\", refreshToken, {\n                            maxAge: 60 * 60 * 24 * 1,\n                            path: \"/\"\n                        });\n                        api.defaults.headers[\"Authorization\"] = `Bearer ${token}`;\n                        failedRequestsQueue.forEach((request)=>request.onSuccess(token));\n                        failedRequestsQueue = [];\n                    }).catch((error)=>{\n                        failedRequestsQueue.forEach((request)=>request.onFailure(error));\n                        failedRequestsQueue = [];\n                    }).finally(()=>{\n                        isRefreshing = false;\n                    });\n                }\n                return new Promise((resolve, reject)=>{\n                    failedRequestsQueue.push({\n                        onSuccess: (token)=>{\n                            originalConfig.headers[\"Authorization\"] = `Bearer ${token}`;\n                            resolve(api(originalConfig));\n                        },\n                        onFailure: (error)=>{\n                            reject(error);\n                        }\n                    });\n                });\n            }\n        }\n        return Promise.reject(error);\n    });\n    return api;\n}\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmljZXMvYXBpLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMEM7QUFDUTtBQUVsRCxJQUFJRyxlQUFlO0FBQ25CLElBQUlDLHNCQUFzQixFQUFFO0FBRTVCLFNBQVNDLGVBQWVDLE1BQU1DLFNBQVM7SUFDbkMsSUFBSUMsVUFBVVAscURBQVlBLENBQUNLO0lBRTNCLE1BQU1HLE1BQU1ULG9EQUFZLENBQUM7UUFDckJXLFNBQVM7UUFDVEMsU0FBUztZQUNMQyxlQUFlLENBQUMsT0FBTyxFQUFFTCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckQ7SUFDSjtJQUVBQyxJQUFJSyxZQUFZLENBQUNDLFFBQVEsQ0FBQ0MsR0FBRyxDQUN6QkQsQ0FBQUEsV0FBWUEsVUFDWixDQUFDRTtRQUNHLElBQUdBLE1BQU1GLFFBQVEsRUFBRUcsV0FBVyxLQUFLO1lBQy9CLElBQUdELE1BQU1GLFFBQVEsQ0FBQ0ksSUFBSSxLQUFLLHFCQUFpQjtnQkFDeENYLFVBQVVQLHFEQUFZQSxDQUFDSztnQkFFdkIsTUFBTSxFQUFFLHNCQUFzQmMsWUFBWSxFQUFFLEdBQUdaO2dCQUMvQyxNQUFNYSxpQkFBaUJKLE1BQU1LLE1BQU07Z0JBRW5DLElBQUcsQ0FBQ25CLGNBQWE7b0JBQ2JBLGVBQWU7b0JBRWZNLElBQ0tjLElBQUksQ0FBQyxpQkFBaUI7d0JBQUVDLE9BQU9KO29CQUFhLEdBQzVDSyxJQUFJLENBQUNWLENBQUFBO3dCQUNGLE1BQU0sRUFBRVMsS0FBSyxFQUFFSixZQUFZLEVBQUMsR0FBR0wsU0FBU0ksSUFBSTt3QkFFNUNqQixrREFBU0EsQ0FBQ0ksS0FBSyxlQUFla0IsT0FBTzs0QkFDakNFLFFBQVEsS0FBSyxLQUFLLEtBQUs7NEJBQ3ZCQyxNQUFNO3dCQUNWO3dCQUVBekIsa0RBQVNBLENBQUNJLEtBQUssc0JBQXNCYyxjQUFjOzRCQUMvQ00sUUFBUSxLQUFLLEtBQUssS0FBSzs0QkFDdkJDLE1BQU07d0JBQ1Y7d0JBRUFsQixJQUFJbUIsUUFBUSxDQUFDaEIsT0FBTyxDQUFDLGdCQUFnQixHQUFHLENBQUMsT0FBTyxFQUFFWSxNQUFNLENBQUM7d0JBRXpEcEIsb0JBQW9CeUIsT0FBTyxDQUFDQyxDQUFBQSxVQUN4QkEsUUFBUUMsU0FBUyxDQUFDUDt3QkFFdEJwQixzQkFBc0IsRUFBRTtvQkFFNUIsR0FDQzRCLEtBQUssQ0FBQ2YsQ0FBQUE7d0JBQ0hiLG9CQUFvQnlCLE9BQU8sQ0FBQ0MsQ0FBQUEsVUFDeEJBLFFBQVFHLFNBQVMsQ0FBQ2hCO3dCQUV0QmIsc0JBQXNCLEVBQUU7b0JBQzVCLEdBQ0M4QixPQUFPLENBQUM7d0JBQ0wvQixlQUFlO29CQUNuQjtnQkFDUjtnQkFFQSxPQUFPLElBQUlnQyxRQUFRLENBQUNDLFNBQVNDO29CQUN6QmpDLG9CQUFvQmtDLElBQUksQ0FBQzt3QkFDdkJQLFdBQVcsQ0FBQ1A7NEJBQ1ZILGVBQWVULE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sRUFBRVksTUFBTSxDQUFDOzRCQUMzRFksUUFBUTNCLElBQUlZO3dCQUNkO3dCQUNBWSxXQUFXLENBQUNoQjs0QkFDVm9CLE9BQU9wQjt3QkFDVDtvQkFDRjtnQkFDSjtZQUNKO1FBQ0o7UUFFQSxPQUFPa0IsUUFBUUUsTUFBTSxDQUFDcEI7SUFDMUI7SUFFSixPQUFPUjtBQUNYO0FBRXlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGNjLy4vc3JjL3NlcnZpY2VzL2FwaS50cz85NTZlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyBBeGlvc0Vycm9yIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBwYXJzZUNvb2tpZXMsIHNldENvb2tpZSB9IGZyb20gXCJub29raWVzXCI7XG5cbmxldCBpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbmxldCBmYWlsZWRSZXF1ZXN0c1F1ZXVlID0gW107XG5cbmZ1bmN0aW9uIHNldHVwQVBJQ2xpZW50KGN0eCA9IHVuZGVmaW5lZCl7XG4gICAgbGV0IGNvb2tpZXMgPSBwYXJzZUNvb2tpZXMoY3R4KTtcblxuICAgIGNvbnN0IGFwaSA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICAgIGJhc2VVUkw6IFwiaHR0cDovL2xvY2FsaG9zdDozMzMzXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtjb29raWVzW1widG9rZW4udG9rZW5cIl19YFxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcGkuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcbiAgICAgICAgcmVzcG9uc2UgPT4gcmVzcG9uc2UsXG4gICAgICAgIChlcnJvcjogQXhpb3NFcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IucmVzcG9uc2U/LnN0YXR1cyA9PT0gNDAxICl7XG4gICAgICAgICAgICAgICAgaWYoZXJyb3IucmVzcG9uc2UuZGF0YSA9PT0gXCJUb2tlbiBpbnbDoWxpZG9cIil7XG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZXMgPSBwYXJzZUNvb2tpZXMoY3R4KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IFwidG9rZW4ucmVmcmVzaFRva2VuXCI6IHJlZnJlc2hUb2tlbiB9ID0gY29va2llcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxDb25maWcgPSBlcnJvci5jb25maWc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzUmVmcmVzaGluZyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1JlZnJlc2hpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zdChcInJlZnJlc2gtdG9rZW5cIiwgeyB0b2tlbjogcmVmcmVzaFRva2VuIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHRva2VuLCByZWZyZXNoVG9rZW59ID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDb29raWUoY3R4LCBcInRva2VuLnRva2VuXCIsIHRva2VuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhBZ2U6IDYwICogNjAgKiAyNCAqIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIi9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDb29raWUoY3R4LCBcInRva2VuLnJlZnJlc2hUb2tlblwiLCByZWZyZXNoVG9rZW4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IFwiL1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuZGVmYXVsdHMuaGVhZGVyc1tcIkF1dGhvcml6YXRpb25cIl0gPSBgQmVhcmVyICR7dG9rZW59YDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsZWRSZXF1ZXN0c1F1ZXVlLmZvckVhY2gocmVxdWVzdCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vblN1Y2Nlc3ModG9rZW4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsZWRSZXF1ZXN0c1F1ZXVlID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFJlcXVlc3RzUXVldWUuZm9yRWFjaChyZXF1ZXN0ID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbkZhaWx1cmUoZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFJlcXVlc3RzUXVldWUgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbGVkUmVxdWVzdHNRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiAodG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29uZmlnLmhlYWRlcnNbXCJBdXRob3JpemF0aW9uXCJdID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhcGkob3JpZ2luYWxDb25maWcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25GYWlsdXJlOiAoZXJyb3I6IEF4aW9zRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGFwaTtcbn1cblxuZXhwb3J0IHsgc2V0dXBBUElDbGllbnQgfSJdLCJuYW1lcyI6WyJheGlvcyIsInBhcnNlQ29va2llcyIsInNldENvb2tpZSIsImlzUmVmcmVzaGluZyIsImZhaWxlZFJlcXVlc3RzUXVldWUiLCJzZXR1cEFQSUNsaWVudCIsImN0eCIsInVuZGVmaW5lZCIsImNvb2tpZXMiLCJhcGkiLCJjcmVhdGUiLCJiYXNlVVJMIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJpbnRlcmNlcHRvcnMiLCJyZXNwb25zZSIsInVzZSIsImVycm9yIiwic3RhdHVzIiwiZGF0YSIsInJlZnJlc2hUb2tlbiIsIm9yaWdpbmFsQ29uZmlnIiwiY29uZmlnIiwicG9zdCIsInRva2VuIiwidGhlbiIsIm1heEFnZSIsInBhdGgiLCJkZWZhdWx0cyIsImZvckVhY2giLCJyZXF1ZXN0Iiwib25TdWNjZXNzIiwiY2F0Y2giLCJvbkZhaWx1cmUiLCJmaW5hbGx5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwdXNoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/services/api.ts\n");

/***/ }),

/***/ "./src/services/apiClient.ts":
/*!***********************************!*\
  !*** ./src/services/apiClient.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api)\n/* harmony export */ });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./src/services/api.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_api__WEBPACK_IMPORTED_MODULE_0__]);\n_api__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst api = (0,_api__WEBPACK_IMPORTED_MODULE_0__.setupAPIClient)();\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmljZXMvYXBpQ2xpZW50LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVDO0FBRXZDLE1BQU1DLE1BQU1ELG9EQUFjQTtBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGNjLy4vc3JjL3NlcnZpY2VzL2FwaUNsaWVudC50cz83ZDAxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNldHVwQVBJQ2xpZW50IH0gZnJvbSBcIi4vYXBpXCI7XG5cbmNvbnN0IGFwaSA9IHNldHVwQVBJQ2xpZW50KCk7XG5cbmV4cG9ydCB7IGFwaSB9Il0sIm5hbWVzIjpbInNldHVwQVBJQ2xpZW50IiwiYXBpIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/services/apiClient.ts\n");

/***/ }),

/***/ "./src/services/queryClient.ts":
/*!*************************************!*\
  !*** ./src/services/queryClient.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   queryClient: () => (/* binding */ queryClient)\n/* harmony export */ });\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-query */ \"react-query\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_0__);\n\nconst queryClient = new react_query__WEBPACK_IMPORTED_MODULE_0__.QueryClient();\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmljZXMvcXVlcnlDbGllbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBRTFDLE1BQU1DLGNBQWMsSUFBSUQsb0RBQVdBO0FBRVoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90Y2MvLi9zcmMvc2VydmljZXMvcXVlcnlDbGllbnQudHM/NTNmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBRdWVyeUNsaWVudCB9IGZyb20gXCJyZWFjdC1xdWVyeVwiO1xuXG5jb25zdCBxdWVyeUNsaWVudCA9IG5ldyBRdWVyeUNsaWVudCgpO1xuXG5leHBvcnQgeyBxdWVyeUNsaWVudCB9O1xuIl0sIm5hbWVzIjpbIlF1ZXJ5Q2xpZW50IiwicXVlcnlDbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/services/queryClient.ts\n");

/***/ }),

/***/ "./src/styles/theme.ts":
/*!*****************************!*\
  !*** ./src/styles/theme.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   theme: () => (/* binding */ theme)\n/* harmony export */ });\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__]);\n_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst theme = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.extendTheme)({\n    colors: {\n        gray: {\n            \"900\": \"#181B23\",\n            \"800\": \"#1F2029\",\n            \"700\": \"#353646\",\n            \"600\": \"#4B4D63\",\n            \"500\": \"#616480\",\n            \"400\": \"#797D9A\",\n            \"300\": \"#9699B0\",\n            \"200\": \"#B3B5C6\",\n            \"100\": \"#D1D2DC\",\n            \"50\": \"#EEEEF2\"\n        }\n    },\n    fonts: {\n        heading: \"Roboto\",\n        body: \"DM+Sans\"\n    },\n    styles: {\n        global: {\n            body: {\n                bgGradient: \"linear(to-l, #FFFFFF, #000080)\",\n                color: \"gray.900\"\n            }\n        }\n    }\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3R5bGVzL3RoZW1lLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQStDO0FBRXhDLE1BQU1DLFFBQVFELDZEQUFXQSxDQUFDO0lBQzdCRSxRQUFRO1FBQ0pDLE1BQU07WUFDRixPQUFPO1lBQ1AsT0FBTztZQUNQLE9BQU87WUFDUCxPQUFPO1lBQ1AsT0FBTztZQUNQLE9BQU87WUFDUCxPQUFPO1lBQ1AsT0FBTztZQUNQLE9BQU87WUFDUCxNQUFNO1FBQ1Y7SUFDSjtJQUNBQyxPQUFPO1FBQ0hDLFNBQVM7UUFDVEMsTUFBTTtJQUNWO0lBQ0FDLFFBQVE7UUFDSkMsUUFBUTtZQUNKRixNQUFNO2dCQUNGRyxZQUFZO2dCQUNaQyxPQUFPO1lBQ1g7UUFDSjtJQUNKO0FBQ0osR0FBRyIsInNvdXJjZXMiOlsid2VicGFjazovL3RjYy8uL3NyYy9zdHlsZXMvdGhlbWUudHM/NTE2MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHRlbmRUaGVtZSB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XG5cbmV4cG9ydCBjb25zdCB0aGVtZSA9IGV4dGVuZFRoZW1lKHtcbiAgICBjb2xvcnM6IHtcbiAgICAgICAgZ3JheToge1xuICAgICAgICAgICAgXCI5MDBcIjogXCIjMTgxQjIzXCIsXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiMxRjIwMjlcIixcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzM1MzY0NlwiLFxuICAgICAgICAgICAgXCI2MDBcIjogXCIjNEI0RDYzXCIsXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiM2MTY0ODBcIixcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiIzc5N0Q5QVwiLFxuICAgICAgICAgICAgXCIzMDBcIjogXCIjOTY5OUIwXCIsXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNCM0I1QzZcIixcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI0QxRDJEQ1wiLFxuICAgICAgICAgICAgXCI1MFwiOiBcIiNFRUVFRjJcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBmb250czoge1xuICAgICAgICBoZWFkaW5nOiAnUm9ib3RvJyxcbiAgICAgICAgYm9keTogJ0RNK1NhbnMnXG4gICAgfSxcbiAgICBzdHlsZXM6IHtcbiAgICAgICAgZ2xvYmFsOiB7XG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgYmdHcmFkaWVudDogJ2xpbmVhcih0by1sLCAjRkZGRkZGLCAjMDAwMDgwKScsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdncmF5LjkwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pOyJdLCJuYW1lcyI6WyJleHRlbmRUaGVtZSIsInRoZW1lIiwiY29sb3JzIiwiZ3JheSIsImZvbnRzIiwiaGVhZGluZyIsImJvZHkiLCJzdHlsZXMiLCJnbG9iYWwiLCJiZ0dyYWRpZW50IiwiY29sb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/styles/theme.ts\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "nookies":
/*!**************************!*\
  !*** external "nookies" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("nookies");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("react-dom");

/***/ }),

/***/ "react-query":
/*!******************************!*\
  !*** external "react-query" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("react-query");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ ((module) => {

module.exports = import("@chakra-ui/react");;

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();