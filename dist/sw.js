if (!self.define) {
  let s,
    e = {};
  const l = (l, i) => (
    (l = new URL(l + ".js", i).href),
    e[l] ||
      new Promise((e) => {
        if ("document" in self) {
          const s = document.createElement("script");
          (s.src = l), (s.onload = e), document.head.appendChild(s);
        } else (s = l), importScripts(l), e();
      }).then(() => {
        let s = e[l];
        if (!s) throw new Error(`Module ${l} didn’t register its module`);
        return s;
      })
  );
  self.define = (i, r) => {
    const n =
      s ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (e[n]) return;
    let u = {};
    const o = (s) => l(s, n),
      t = { module: { uri: n }, exports: u, require: o };
    e[n] = Promise.all(i.map((s) => t[s] || o(s))).then((s) => (r(...s), u));
  };
}
define(["./workbox-5ffe50d4"], function (s) {
  "use strict";
  self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        {
          url: "@/assets/_commonjs-dynamic-modules-D62IZqYr.js",
          revision: null,
        },
        { url: "@/assets/404-BsUUwi2j.js", revision: null },
        { url: "@/assets/404-DUm08_0T.svg", revision: null },
        { url: "@/assets/EmployeeServices-DCo3nJe0.js", revision: null },
        { url: "@/assets/AnimatedContent-DxdoWq6S.js", revision: null },
        { url: "@/assets/Applicants-srAr_mm1.js", revision: null },
        { url: "@/assets/Attributes-CgYAjOu7.js", revision: null },
        { url: "@/assets/BulkActionDrawer-DXuxPITU.js", revision: null },
        { url: "@/assets/Category-BBkcPfAN.js", revision: null },
        { url: "@/assets/CategoryTable-CEaeejR7.js", revision: null },
        { url: "@/assets/ChildAttributes-C4McxQy1.js", revision: null },
        { url: "@/assets/ChildCategory-Tp0jPI3J.js", revision: null },
        { url: "@/assets/ComingSoon-CA13yvO5.js", revision: null },
        { url: "@/assets/Coupons-1ccztEYV.js", revision: null },
        { url: "@/assets/CouponServices-DVqlvpNV.js", revision: null },
        { url: "@/assets/Currencies-hizZnWrG.js", revision: null },
        { url: "@/assets/CurrencyServices-Nd0ijAt2.js", revision: null },
        { url: "@/assets/Dashboard-fdCxZk5-.js", revision: null },
        { url: "@/assets/DeleteModal-DBS0drho.js", revision: null },
        { url: "@/assets/DownloadDataModal-BHJv26PI.js", revision: null },
        { url: "@/assets/DrawerButton-C_eRd4SV.js", revision: null },
        { url: "@/assets/DropdownButton-RcIAkuU0.js", revision: null },
        { url: "@/assets/EditDeleteButton-vDBQSFk1.js", revision: null },
        { url: "@/assets/EditProfile-CTrFmnoh.js", revision: null },
        { url: "@/assets/Error-CAyZwxuL.js", revision: null },
        { url: "@/assets/exportFromJSON-fDIoOtpr.js", revision: null },
        {
          url: "@/assets/forgot-password-office-dark-CQOqfqw9.js",
          revision: null,
        },
        { url: "@/assets/ForgotPassword-BZ0xiGwC.js", revision: null },
        { url: "@/assets/index-BmgLekvI.js", revision: null },
        { url: "@/assets/index-BP3Elrsf.js", revision: null },
        { url: "@/assets/index-C148XJoK.js", revision: null },
        { url: "@/assets/index-c8XKtqQJ.js", revision: null },
        { url: "@/assets/index-DAWw38fw.js", revision: null },
        { url: "@/assets/index-Dof_b8un.js", revision: null },
        { url: "@/assets/index-Dw8nQtKq.js", revision: null },
        { url: "@/assets/index-mf-5gI8D.js", revision: null },
        { url: "@/assets/index.esm-CaGI7Xwy.js", revision: null },
        { url: "@/assets/index.esm-Cdn91zGb.js", revision: null },
        { url: "@/assets/index.esm-CDuTo3hy.js", revision: null },
        { url: "@/assets/index.esm-zzOt2kun.js", revision: null },
        { url: "@/assets/index.prod-DbQKEzhD.js", revision: null },
        { url: "@/assets/InputArea-BTU-zYGT.js", revision: null },
        { url: "@/assets/InputAreaTwo-D-KP66FY.js", revision: null },
        { url: "@/assets/InputValue-Cp5rRUHe.js", revision: null },
        { url: "@/assets/Job-DJ_rpDy6.js", revision: null },
        { url: "@/assets/Jobs-5DJe0_ns.js", revision: null },
        { url: "@/assets/LabelArea-cax2uOIz.js", revision: null },
        { url: "@/assets/Languages-B7bd5aVv.js", revision: null },
        { url: "@/assets/Layout-wyywK-iW.js", revision: null },
        { url: "@/assets/Loader-CFidX98g.js", revision: null },
        { url: "@/assets/Loading-CfBoaEQd.js", revision: null },
        { url: "@/assets/Login-rtjBKuXa.js", revision: null },
        { url: "@/assets/MainDrawer-BzwhB2Ux.js", revision: null },
        { url: "@/assets/ManageCompanies-CMZsybSr.js", revision: null },
        { url: "@/assets/no-result-P2YfVoix.svg", revision: null },
        { url: "@/assets/NotFound-pBBbNNvt.js", revision: null },
        { url: "@/assets/Notifications-DqaNHFTG.js", revision: null },
        { url: "@/assets/OrderInvoice-DpSHwAYn.js", revision: null },
        { url: "@/assets/Orders-q8IggvN-.js", revision: null },
        { url: "@/assets/OrderServices-juQyfnRG.js", revision: null },
        { url: "@/assets/PageTitle-DEObuauL.js", revision: null },
        { url: "@/assets/ParentCategory-CnI2WAL_.js", revision: null },
        { url: "@/assets/PostJob-3JQ-snzd.js", revision: null },
        { url: "@/assets/ProductDetails-BD0JHhik.js", revision: null },
        { url: "@/assets/ProductDrawer-LqpdFWiy.js", revision: null },
        { url: "@/assets/Products-1MYWXb86.js", revision: null },
        { url: "@/assets/ProductServices-BDAC2a2r.js", revision: null },
        { url: "@/assets/progress-Dm-zmprq.svg", revision: null },
        { url: "@/assets/RecentJobsTable-B8MLOjO0.js", revision: null },
        { url: "@/assets/ResetPassword-DM9D0HQf.js", revision: null },
        { url: "@/assets/SelectLanguageTwo-BJ6bsHmL.js", revision: null },
        { url: "@/assets/SelectRole-DGgd4k-h.js", revision: null },
        { url: "@/assets/Setting-BsXeczSD.js", revision: null },
        { url: "@/assets/SettingContainer-Buj7DsK0.js", revision: null },
        { url: "@/assets/SignUp--1QeNyT8.js", revision: null },
        { url: "@/assets/spinner-CkndCogW.js", revision: null },
        { url: "@/assets/Staff-DRZOVT3y.js", revision: null },
        { url: "@/assets/Status-BDv4IR8F.js", revision: null },
        { url: "@/assets/StoreHome-B1oKXHa3.js", revision: null },
        { url: "@/assets/StoreSetting-VC-GC8Ea.js", revision: null },
        { url: "@/assets/SwitchToggle-eH4YlbEX.js", revision: null },
        { url: "@/assets/TableLoading-DwHTQ3c9.js", revision: null },
        { url: "@/assets/toast-BI9J6URY.js", revision: null },
        { url: "@/assets/Tooltip-CFwl-d93.js", revision: null },
        { url: "@/assets/Uploader-DNc8SyrL.js", revision: null },
        { url: "@/assets/UploadMany-D-Y4WuEs.js", revision: null },
        { url: "@/assets/useAsync-DyGpFV_t.js", revision: null },
        { url: "@/assets/useAttributeSubmit-CsvoBueU.js", revision: null },
        { url: "@/assets/useDisableForDemo-VTqm39zE.js", revision: null },
        { url: "@/assets/useFilter-0v66f7Gf.js", revision: null },
        { url: "@/assets/useJobSubmit-C6lnMzvx.js", revision: null },
        { url: "@/assets/useLoginSubmit-B1Q5NW3v.js", revision: null },
        { url: "@/assets/User-Sxj5RkGK.js", revision: null },
        { url: "@/assets/Users-CZBX4yYC.js", revision: null },
        { url: "@/assets/useStaffSubmit-D6PEjKCo.js", revision: null },
        { url: "@/assets/useToggleDrawer-bq0Go4Hg.js", revision: null },
        { url: "@/assets/useTranslationValue-BzL6Lo2i.js", revision: null },
        { url: "@/assets/workbox-window.prod.es5-B9K5rw8f.js", revision: null },
        {
          url: "dashtar-admin.png",
          revision: "bb31262c53ca8c0bda2595391cf117a2",
        },
        { url: "favicon.ico", revision: "c92b85a5b907c70211f4ec25e29a8c4a" },
        { url: "favicon.png", revision: "0033e08ea1185a9ef4ddea787f470df5" },
        {
          url: "icon-192x192.png",
          revision: "47e2812c3e78f1903ccd46f0545f5d48",
        },
        {
          url: "icon-256x256.png",
          revision: "5cfadd2f4679b3d86f1d994297809226",
        },
        {
          url: "icon-384x384.png",
          revision: "e793bffd9497800be7d461caa873b96b",
        },
        {
          url: "icon-512x512.png",
          revision: "b9df59369ad910b5d3e338e9076fd944",
        },
        { url: "index.html", revision: "a22dc56788a1434d80b213d8b2ee90f0" },
        { url: "logo-dark.svg", revision: "6d56d5e9299f4a31803292ce79f4ff6b" },
        { url: "logo-light.svg", revision: "46c5c929a9c91b74433bd947534fd2a8" },
        { url: "logo192.png", revision: "33dbdd0177549353eeeb785d02c294af" },
        { url: "logo512.png", revision: "917515db74ea8d1aee6a246cfbcc0b45" },
        { url: "offline.html", revision: "ee62f74acb570969fe35b0a51242fffc" },
        { url: "favicon.ico", revision: "c92b85a5b907c70211f4ec25e29a8c4a" },
        {
          url: "icon-192x192.png",
          revision: "47e2812c3e78f1903ccd46f0545f5d48",
        },
        {
          url: "icon-256x256.png",
          revision: "5cfadd2f4679b3d86f1d994297809226",
        },
        {
          url: "icon-384x384.png",
          revision: "e793bffd9497800be7d461caa873b96b",
        },
        {
          url: "icon-512x512.png",
          revision: "b9df59369ad910b5d3e338e9076fd944",
        },
        {
          url: "manifest.webmanifest",
          revision: "92396266c5280f48bca0800b214bcc7c",
        },
      ],
      {}
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))
    );
});
