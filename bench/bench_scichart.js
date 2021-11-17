// NOTE: Actual scichart benchmark application is a TypeScript app built in bench/scichart/. This file just connects it in a hacky way with the other pure JS applications.

const BENCHMARK_IMPLEMENTATION = (() => {
    const beforeStart = () => {
      return new Promise((resolve, reject) => {
        const bundleScript1 = document.createElement("script");
        bundleScript1.src = "scichart/dist/vendors~main.bundle.js";
        const bundleScript2 = document.createElement("script");
        bundleScript2.src = "scichart/dist/main.bundle.js";

        Promise.all([bundleScript1, bundleScript2].map(script => new Promise((resolve, reject) => {
            script.onload = resolve
        })))
            .then(resolve)

        document.body.append(bundleScript1);
        document.body.append(bundleScript2);

        new Promise(async (resolve) => {
            while (!window.BENCHMARK_IMPLEMENTATION_SCICHART) {
                await new Promise(resolve => setTimeout(resolve, 100))
            }
            resolve()
        }).then(() => {
            for (const key of Object.keys(window.BENCHMARK_IMPLEMENTATION_SCICHART)) {
                BENCHMARK_IMPLEMENTATION[key] = window.BENCHMARK_IMPLEMENTATION_SCICHART[key]
            }
            resolve()
        })
      });
    };
  
    return {
      dataFormat: 'individual-xy-lists',
      beforeStart
    };
  })();
  