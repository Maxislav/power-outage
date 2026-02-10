const u = `<div class="clouds">\r
    <div class="clouds__front">\r
        <div>\r
            <svg preserveAspectRatio="none" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">\r
                <defs>\r
                    <radialGradient id="cloudGrad" cx="50%" cy="50%" r="140%" fx="10%" fy="1%"\r
                                    gradientTransform="translate(0, 0) scale(1, 0.3)"\r
                    >\r
                        <stop offset="0%" style="stop-color:white; stop-opacity:0"/>\r
                        <stop offset="5%" style="stop-color:white; stop-opacity:1"/>\r
                        <stop offset="7%" style="stop-color:white; stop-opacity:1"/>\r
                        <stop offset="20%" style="stop-color:white; stop-opacity:1"/>\r
                        <stop offset="60%" style="stop-color:#dddddd; stop-opacity:1"/>\r
\r
<!--                        <stop offset="60%" style="stop-color:#7e8088; stop-opacity:1"/>-->\r
                        <stop offset="70%" style="stop-color:#394a5e; stop-opacity:1"/>\r
                        <stop offset="90%" style="stop-color:#394a5e; stop-opacity:1"/>\r
                        <stop offset="100%" style="stop-color:#394a5e; stop-opacity:0"/>\r
                    </radialGradient>\r
\r
                    <filter id="fluffy" x="-50%" y="-50%" width="200%" height="200%">\r
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />\r
                    </filter>\r
\r
                    <filter id="shadow" x="-20%" y="-20%" width="300%" height="300%">\r
                        <feDropShadow dx="0" dy="3" stdDeviation="1" flood-color="black" flood-opacity="0.7"/>\r
                    </filter>\r
                </defs>\r
\r
                <g filter="url(#shadow)">\r
                    <g filter="url(#fluffy)" fill="url(#cloudGrad)" transform="scale(1, 0.8)" #cloudsContainer1>\r
                    </g>\r
                </g>\r
\r
                <g filter="url(#shadow)">\r
                    <g filter="url(#fluffy)" fill="url(#cloudGrad)" transform="scale(1, 1)" #cloudsContainer2>\r
                    </g>\r
                </g>\r
                <g filter="url(#shadow)">\r
                    <g filter="url(#fluffy)" fill="url(#cloudGrad)" transform="scale(1, 1)" #cloudsContainer3>\r
                    </g>\r
                </g>\r
            </svg>\r
        </div>\r
    </div>\r
</div>`;
function i(r, t) {
  return Math.floor(Math.random() * (t - r + 1)) + r;
}
function c(r, t, o = 3) {
  let s = 0;
  for (let n = 0; n < o; n++)
    s += Math.random();
  const e = s / o;
  return Math.floor(e * (t - r + 1)) + r;
}
class p {
  cloudsContainerList;
  childEls = [];
  options = { element: "#app", density: 1 };
  cloudsAll = 1;
  constructor(t = {}) {
    this.options = {
      ...this.options,
      ...t
    }, this.cloudsAll = this.options.density;
    const o = document.createElement("slot");
    o.innerHTML = u, this.cloudsContainerList = [
      o.querySelector("[\\#cloudsContainer1]"),
      o.querySelector("[\\#cloudsContainer2]"),
      o.querySelector("[\\#cloudsContainer3]")
    ], typeof this.options.element == "string" ? document.querySelector(this.options.element).appendChild(o) : this.options.element.appendChild(o);
  }
  init() {
    for (; this.childEls.length; )
      this.childEls.pop().remove();
    return this.cloudsContainerList.forEach((t) => {
      this.cloudsDraw(t);
    }), this;
  }
  update(t = {}) {
    return this.options = {
      ...this.options,
      ...t
    }, this.cloudsAll = this.options.density, this.init(), this;
  }
  cloudsDraw(t) {
    const o = "http://www.w3.org/2000/svg";
    for (let s = 0; s < 50 + 100 * this.cloudsAll / 0.5; s++) {
      const e = document.createElementNS(o, "g");
      this.childEls.push(e), e.innerHTML = this.getCloudBlock(), t.appendChild(e);
    }
  }
  getCloudBlock() {
    const t = i(1, 8), o = i(10, 15), s = c(
      50 - 80 * this.cloudsAll,
      50 + 70 * this.cloudsAll
    ), e = c(1, 20), n = i(40, 30), d = i(
      n - 10 * this.cloudsAll,
      n - 20 * this.cloudsAll
    ), l = i(10, 20), a = i(0, 20);
    return `
           <circle cx="${s}" cy="20" r="7">
                        <animate attributeName="opacity" values="0;1;1;0.2;0" begin="-${a}s" dur="${l}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="cy" values="${n};${d}" begin="-${a}s" dur="${l}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="cx" values="${s};${s + e}" begin="-${a}s" dur="${l}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="r" values="${t};${o}" dur="${l}s" begin="-${a}s"  repeatCount="indefinite" ></animate>
           </circle>
        `;
  }
}
export {
  p as Cloud
};
