System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "all.js": [
      "app/ui/win/win.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/win/dlg.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/tabs/tabs.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/select/select.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/pager/pager.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/notify/notify.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/mselect/mselect.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/grid/grid.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/date/date-ex.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/app/app.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/win/cs-win.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/tabs/cs-tabs.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/tabs/cs-tab.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/select/cs-select.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/pager/cs-pager.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/mselect/cs-mselect.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/grid/cs-grid.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/grid/cs-col.html!github:systemjs/plugin-text@0.0.4",
      "app/chs/date/cs-date.html!github:systemjs/plugin-text@0.0.4",
      "app/ui/win/win.js",
      "app/chs/win/win-svc.js",
      "npm:aurelia-framework@1.0.0-beta.1.1.1",
      "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0",
      "app/chs/chs.js",
      "app/chs/win/win-controller.js",
      "app/chs/win/cs-win.js",
      "npm:aurelia-framework@1.0.0-beta.1.1.1/aurelia-framework",
      "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0/aurelia-event-aggregator",
      "app/chs/resizable.js",
      "app/chs/draggable.js",
      "npm:core-js@2.0.3",
      "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "npm:aurelia-templating@1.0.0-beta.1.1.0",
      "npm:aurelia-path@1.0.0-beta.1.1.0",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "npm:aurelia-loader@1.0.0-beta.1.1.0",
      "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "npm:aurelia-binding@1.0.0-beta.1.1.1",
      "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "npm:aurelia-task-queue@1.0.0-beta.1.1.0",
      "npm:core-js@2.0.3/client/shim.min",
      "npm:aurelia-logging@1.0.0-beta.1.1.1/aurelia-logging",
      "npm:aurelia-templating@1.0.0-beta.1.1.0/aurelia-templating",
      "npm:aurelia-path@1.0.0-beta.1.1.0/aurelia-path",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2/aurelia-dependency-injection",
      "npm:aurelia-loader@1.0.0-beta.1.1.0/aurelia-loader",
      "npm:aurelia-pal@1.0.0-beta.1.1.1/aurelia-pal",
      "npm:aurelia-binding@1.0.0-beta.1.1.1/aurelia-binding",
      "npm:aurelia-metadata@1.0.0-beta.1.1.3/aurelia-metadata",
      "npm:aurelia-task-queue@1.0.0-beta.1.1.0/aurelia-task-queue",
      "github:jspm/nodelibs-process@0.1.2",
      "github:jspm/nodelibs-process@0.1.2/index",
      "npm:process@0.11.2",
      "npm:process@0.11.2/browser",
      "app/ui/win/dlg.js",
      "app/ui/tabs/tabs.js",
      "app/ui/select/select.js",
      "app/ui/pager/pager.js",
      "app/ui/notify/notify.js",
      "app/chs/notify/notify.js",
      "app/ui/mselect/mselect.js",
      "app/ui/grid/grid.js",
      "app/ui/date/date-ex.js",
      "app/ui/app/app.js",
      "app/res/index.js",
      "app/main.js",
      "app/chs/tabs/cs-tabs.js",
      "app/chs/tabs/cs-tab.js",
      "app/chs/select/cs-select.js",
      "app/chs/ddl/ddl.js",
      "app/chs/pager/cs-pager.js",
      "app/chs/mselect/cs-mselect.js",
      "app/chs/grid/cs-grid.js",
      "app/chs/grid/cs-col.js",
      "app/chs/date/cs-date.js",
      "app/chs/date/calendar-popup.js",
      "github:systemjs/plugin-text@0.0.4",
      "github:systemjs/plugin-text@0.0.4/text",
      "npm:aurelia-templating-binding@1.0.0-beta.1.1.0",
      "npm:aurelia-templating-binding@1.0.0-beta.1.1.0/aurelia-templating-binding",
      "npm:aurelia-logging-console@1.0.0-beta.1.1.3",
      "npm:aurelia-logging-console@1.0.0-beta.1.1.3/aurelia-logging-console",
      "npm:aurelia-history-browser@1.0.0-beta.1.1.1",
      "npm:aurelia-history-browser@1.0.0-beta.1.1.1/aurelia-history-browser",
      "npm:aurelia-history@1.0.0-beta.1.1.1",
      "npm:aurelia-history@1.0.0-beta.1.1.1/aurelia-history",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.0",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.0/aurelia-templating-router",
      "npm:aurelia-router@1.0.0-beta.1.1.0",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.0/route-href",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.0/route-loader",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.0/router-view",
      "npm:aurelia-router@1.0.0-beta.1.1.0/aurelia-router",
      "npm:aurelia-route-recognizer@1.0.0-beta.1.1.0",
      "npm:aurelia-route-recognizer@1.0.0-beta.1.1.0/aurelia-route-recognizer",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/aurelia-templating-resources",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/compose",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/if",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/with",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/repeat",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/focus",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/sanitize-html",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/show",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/replaceable",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/compile-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/view-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/dynamic-element",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/css-resource",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/throttle-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/binding-mode-behaviors",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/html-sanitizer",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/debounce-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/signal-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/update-trigger-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/binding-signaler",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/repeat-strategy-locator",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/repeat-utilities",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/analyze-view-factory",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/null-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/set-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/array-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/map-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.0/number-repeat-strategy",
      "npm:aurelia-loader-default@1.0.0-beta.1.1.1",
      "npm:aurelia-loader-default@1.0.0-beta.1.1.1/aurelia-loader-default",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.1.1",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.1.1/aurelia-bootstrapper",
      "npm:aurelia-pal-browser@1.0.0-beta.1.1.2",
      "npm:aurelia-pal-browser@1.0.0-beta.1.1.2/aurelia-pal-browser"
    ]
  },

  map: {
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-beta.1.1.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.1.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.1.1",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.1.1",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1.1.3",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.1.0",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.1.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.1.0",
    "text": "github:systemjs/plugin-text@0.0.4",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-binding@1.0.0-beta.1.1.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-bootstrapper@1.0.0-beta.1.1.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.1.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.1.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.1.1",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.1.2",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.0",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.1.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.1.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-framework@1.0.0-beta.1.1.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-history-browser@1.0.0-beta.1.1.1": {
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-loader-default@1.0.0-beta.1.1.1": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-loader@1.0.0-beta.1.1.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0"
    },
    "npm:aurelia-logging-console@1.0.0-beta.1.1.3": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-metadata@1.0.0-beta.1.1.3": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-pal-browser@1.0.0-beta.1.1.2": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-route-recognizer@1.0.0-beta.1.1.0": {
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-router@1.0.0-beta.1.1.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.0",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-task-queue@1.0.0-beta.1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-templating-binding@1.0.0-beta.1.1.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.0"
    },
    "npm:aurelia-templating-resources@1.0.0-beta.1.1.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:aurelia-templating-router@1.0.0-beta.1.1.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.0"
    },
    "npm:aurelia-templating@1.0.0-beta.1.1.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.3",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.0",
      "core-js": "npm:core-js@2.0.3"
    },
    "npm:core-js@2.0.3": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
