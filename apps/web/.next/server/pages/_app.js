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

/***/ "./lib/supabaseClient.ts":
/*!*******************************!*\
  !*** ./lib/supabaseClient.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst url = \"https://mwfiaoueflzroajxqdde.supabase.co\";\nconst anon = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Zmlhb3VlZmx6cm9hanhxZGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDU0MDUsImV4cCI6MjA3Njk4MTQwNX0.STZ4XCpNPiThayD7Wfqp5Mqz3WnFiiM8wlX2Als_WQ8\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, anon);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2VDbGllbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXFEO0FBRXJELE1BQU1DLE1BQU1DLDBDQUFvQztBQUNoRCxNQUFNRyxPQUFPSCxrTkFBeUM7QUFFL0MsTUFBTUssV0FBV1AsbUVBQVlBLENBQUNDLEtBQUtJLE1BQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWIvLi9saWIvc3VwYWJhc2VDbGllbnQudHM/M2E3ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuXG5jb25zdCB1cmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwhO1xuY29uc3QgYW5vbiA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHVybCwgYW5vbik7XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwidXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsImFub24iLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsInN1cGFiYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/supabaseClient.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"../../node_modules/.pnpm/next@14.2.33_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/supabaseClient */ \"./lib/supabaseClient.ts\");\n\n\n\n\nfunction Toolbar({ isAdmin, hasSession }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const go = (p)=>()=>router.push(p);\n    const signOut = async ()=>{\n        await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_3__.supabase.auth.signOut();\n        router.push(\"/login\");\n    };\n    if (!hasSession) return null;\n    if (isAdmin) {\n        // Μπάρα μόνο για διαχειριστές\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            style: {\n                display: \"flex\",\n                alignItems: \"center\",\n                gap: 8,\n                padding: \"10px 16px\",\n                background: \"#fff\",\n                borderBottom: \"1px solid #eee\",\n                position: \"sticky\",\n                top: 0,\n                zIndex: 1000\n            },\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    marginLeft: \"auto\",\n                    display: \"flex\",\n                    gap: 8\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: go(\"/\"),\n                        style: {\n                            padding: \"8px 12px\",\n                            border: \"1px solid #ddd\",\n                            borderRadius: 8,\n                            background: \"#fff\"\n                        },\n                        children: \"Αρχική\"\n                    }, void 0, false, {\n                        fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                        lineNumber: 22,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: go(\"/clients/new\"),\n                        style: {\n                            padding: \"8px 12px\",\n                            border: \"1px solid #ddd\",\n                            borderRadius: 8,\n                            background: \"#fff\"\n                        },\n                        children: \"Νέος πελάτης\"\n                    }, void 0, false, {\n                        fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                        lineNumber: 23,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: go(\"/admin/clients\"),\n                        style: {\n                            padding: \"8px 12px\",\n                            border: \"1px solid #ddd\",\n                            borderRadius: 8,\n                            background: \"#fff\"\n                        },\n                        children: \"Πελάτες\"\n                    }, void 0, false, {\n                        fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                        lineNumber: 24,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: signOut,\n                        style: {\n                            padding: \"8px 12px\",\n                            border: \"1px solid #ddd\",\n                            borderRadius: 8,\n                            background: \"#fff\"\n                        },\n                        children: \"Έξοδος\"\n                    }, void 0, false, {\n                        fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                        lineNumber: 25,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                lineNumber: 21,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n            lineNumber: 16,\n            columnNumber: 7\n        }, this);\n    }\n    // Μόνο μικρό “Έξοδος” για θεραπευτές (όχι μπάρα)\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        style: {\n            position: \"fixed\",\n            top: 10,\n            right: 10,\n            zIndex: 1000\n        },\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n            onClick: signOut,\n            style: {\n                padding: \"6px 10px\",\n                border: \"1px solid #ddd\",\n                borderRadius: 6,\n                background: \"#fff\",\n                fontSize: 13\n            },\n            children: \"Έξοδος\"\n        }, void 0, false, {\n            fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n            lineNumber: 34,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n        lineNumber: 33,\n        columnNumber: 5\n    }, this);\n}\nfunction MyApp({ Component, pageProps }) {\n    const [isAdmin, setIsAdmin] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [hasSession, setHasSession] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const sub = _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_3__.supabase.auth.onAuthStateChange((_e, session)=>{\n            setHasSession(!!session);\n        });\n        (async ()=>{\n            const { data: { user } } = await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_3__.supabase.auth.getUser();\n            setHasSession(!!user);\n            if (!user) {\n                setIsAdmin(false);\n                return;\n            }\n            // Έλεγχος ΜΟΝΟ από τη βάση: therapists.is_admin\n            try {\n                const { data, error } = await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_3__.supabase.from(\"therapists\").select(\"is_admin\").eq(\"auth_user_id\", user.id).maybeSingle();\n                if (error) {\n                    console.warn(\"therapists is_admin check error:\", error.message);\n                    setIsAdmin(false);\n                } else {\n                    setIsAdmin(!!data?.is_admin);\n                }\n            } catch  {\n                setIsAdmin(false);\n            }\n        })();\n        return ()=>{\n            sub.data?.subscription.unsubscribe();\n        };\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Toolbar, {\n                isAdmin: isAdmin,\n                hasSession: hasSession\n            }, void 0, false, {\n                fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                lineNumber: 82,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/oztzanchotzar/Documents/therapy-center/apps/web/pages/_app.tsx\",\n                lineNumber: 83,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VztnQkFFZCxJQUFJTCxPQUFPO29CQUNUTSxRQUFRQyxJQUFJLENBQUMsb0NBQW9DUCxNQUFNUSxPQUFPO29CQUM5RGpCLFdBQVc7Z0JBQ2IsT0FBTztvQkFDTEEsV0FBVyxDQUFDLENBQUNNLE1BQU1ZO2dCQUNyQjtZQUNGLEVBQUUsT0FBTTtnQkFDTmxCLFdBQVc7WUFDYjtRQUNGO1FBRUEsT0FBTztZQUFRRSxJQUFJSSxJQUFJLEVBQUVhLGFBQWFDO1FBQWU7SUFDdkQsR0FBRyxFQUFFO0lBRUwscUJBQ0U7OzBCQUNFLDhEQUFDbEQ7Z0JBQVFDLFNBQVNBO2dCQUFTQyxZQUFZQTs7Ozs7OzBCQUN2Qyw4REFBQzBCO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5pbXBvcnQgeyBzdXBhYmFzZSB9IGZyb20gJy4uL2xpYi9zdXBhYmFzZUNsaWVudCc7XG5cbmZ1bmN0aW9uIFRvb2xiYXIoeyBpc0FkbWluLCBoYXNTZXNzaW9uIH06IHsgaXNBZG1pbjogYm9vbGVhbjsgaGFzU2Vzc2lvbjogYm9vbGVhbiB9KSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICBjb25zdCBnbyA9IChwOiBzdHJpbmcpID0+ICgpID0+IHJvdXRlci5wdXNoKHApO1xuICBjb25zdCBzaWduT3V0ID0gYXN5bmMgKCkgPT4geyBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25PdXQoKTsgcm91dGVyLnB1c2goJy9sb2dpbicpOyB9O1xuXG4gIGlmICghaGFzU2Vzc2lvbikgcmV0dXJuIG51bGw7XG5cbiAgaWYgKGlzQWRtaW4pIHtcbiAgICAvLyDOnM+AzqzPgc6xIM68z4zOvc6/IM6zzrnOsSDOtM65zrHPh861zrnPgc65z4PPhM6tz4JcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjgsXG4gICAgICAgIHBhZGRpbmc6JzEwcHggMTZweCcsIGJhY2tncm91bmQ6JyNmZmYnLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCAjZWVlJyxcbiAgICAgICAgcG9zaXRpb246J3N0aWNreScsIHRvcDowLCB6SW5kZXg6MTAwMFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDonYXV0bycsIGRpc3BsYXk6J2ZsZXgnLCBnYXA6OCB9fT5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2dvKCcvJyl9IHN0eWxlPXt7cGFkZGluZzonOHB4IDEycHgnLCBib3JkZXI6JzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOjgsIGJhY2tncm91bmQ6JyNmZmYnfX0+zpHPgc+HzrnOus6uPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtnbygnL2NsaWVudHMvbmV3Jyl9IHN0eWxlPXt7cGFkZGluZzonOHB4IDEycHgnLCBib3JkZXI6JzFweCBzb2xpZCAjZGRkJywgYm9yZGVyUmFkaXVzOjgsIGJhY2tncm91bmQ6JyNmZmYnfX0+zp3Orc6/z4Igz4DOtc67zqzPhM63z4I8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2dvKCcvYWRtaW4vY2xpZW50cycpfSBzdHlsZT17e3BhZGRpbmc6JzhweCAxMnB4JywgYm9yZGVyOicxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czo4LCBiYWNrZ3JvdW5kOicjZmZmJ319Ps6gzrXOu86sz4TOtc+CPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtzaWduT3V0fSBzdHlsZT17e3BhZGRpbmc6JzhweCAxMnB4JywgYm9yZGVyOicxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czo4LCBiYWNrZ3JvdW5kOicjZmZmJ319Ps6Izr7Ov860zr/PgjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyDOnM+Mzr3OvyDOvM65zrrPgc+MIOKAnM6Izr7Ov860zr/PguKAnSDOs865zrEgzrjOtc+BzrHPgM61z4XPhM6tz4IgKM+Mz4fOuSDOvM+AzqzPgc6xKVxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246J2ZpeGVkJywgdG9wOjEwLCByaWdodDoxMCwgekluZGV4OjEwMDAgfX0+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9e3NpZ25PdXR9XG4gICAgICAgIHN0eWxlPXt7IHBhZGRpbmc6JzZweCAxMHB4JywgYm9yZGVyOicxcHggc29saWQgI2RkZCcsIGJvcmRlclJhZGl1czo2LCBiYWNrZ3JvdW5kOicjZmZmJywgZm9udFNpemU6MTMgfX1cbiAgICAgID5cbiAgICAgICAgzojOvs6/zrTOv8+CXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCBbaXNBZG1pbiwgc2V0SXNBZG1pbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtoYXNTZXNzaW9uLCBzZXRIYXNTZXNzaW9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YiA9IHN1cGFiYXNlLmF1dGgub25BdXRoU3RhdGVDaGFuZ2UoKF9lLCBzZXNzaW9uKSA9PiB7XG4gICAgICBzZXRIYXNTZXNzaW9uKCEhc2Vzc2lvbik7XG4gICAgfSk7XG5cbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhOiB7IHVzZXIgfSB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG4gICAgICBzZXRIYXNTZXNzaW9uKCEhdXNlcik7XG4gICAgICBpZiAoIXVzZXIpIHsgc2V0SXNBZG1pbihmYWxzZSk7IHJldHVybjsgfVxuXG4gICAgICAvLyDOiM67zrXOs8+Hzr/PgiDOnM6fzp3OnyDOsc+Az4wgz4TOtyDOss6sz4POtzogdGhlcmFwaXN0cy5pc19hZG1pblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgICAgICAuZnJvbSgndGhlcmFwaXN0cycpXG4gICAgICAgICAgLnNlbGVjdCgnaXNfYWRtaW4nKVxuICAgICAgICAgIC5lcSgnYXV0aF91c2VyX2lkJywgdXNlci5pZClcbiAgICAgICAgICAubWF5YmVTaW5nbGUoKTtcblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ3RoZXJhcGlzdHMgaXNfYWRtaW4gY2hlY2sgZXJyb3I6JywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgc2V0SXNBZG1pbihmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0SXNBZG1pbighIWRhdGE/LmlzX2FkbWluKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHNldElzQWRtaW4oZmFsc2UpO1xuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICByZXR1cm4gKCkgPT4geyBzdWIuZGF0YT8uc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7IH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8VG9vbGJhciBpc0FkbWluPXtpc0FkbWlufSBoYXNTZXNzaW9uPXtoYXNTZXNzaW9ufSAvPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VSb3V0ZXIiLCJzdXBhYmFzZSIsIlRvb2xiYXIiLCJpc0FkbWluIiwiaGFzU2Vzc2lvbiIsInJvdXRlciIsImdvIiwicCIsInB1c2giLCJzaWduT3V0IiwiYXV0aCIsImRpdiIsInN0eWxlIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJnYXAiLCJwYWRkaW5nIiwiYmFja2dyb3VuZCIsImJvcmRlckJvdHRvbSIsInBvc2l0aW9uIiwidG9wIiwiekluZGV4IiwibWFyZ2luTGVmdCIsImJ1dHRvbiIsIm9uQ2xpY2siLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJyaWdodCIsImZvbnRTaXplIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzZXRJc0FkbWluIiwic2V0SGFzU2Vzc2lvbiIsInN1YiIsIm9uQXV0aFN0YXRlQ2hhbmdlIiwiX2UiLCJzZXNzaW9uIiwiZGF0YSIsInVzZXIiLCJnZXRVc2VyIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0IiwiZXEiLCJpZCIsIm1heWJlU2luZ2xlIiwiY29uc29sZSIsIndhcm4iLCJtZXNzYWdlIiwiaXNfYWRtaW4iLCJzdWJzY3JpcHRpb24iLCJ1bnN1YnNjcmliZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@14.2.33_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@swc+helpers@0.5.5"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();