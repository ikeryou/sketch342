uniform sampler2D t;
uniform bool useMask;
uniform vec3 c;
uniform vec2 ma;
uniform vec2 mb;
uniform vec2 mc;
uniform float line;

varying vec2 vUv;

void main(void) {
  vec3 p = vec3(vUv, 0.0);

  vec3 v1 = vec3(ma, 0.0);
  vec3 v2 = vec3(mb, 0.0);
  vec3 v3 = vec3(mc, 0.0);

  vec3 pA = cross(v2 - v1, p - v1);
  vec3 pB = cross(v3 - v2, p - v2);
  vec3 pC = cross(v1 - v3, p - v3);

  float dotA = dot(pA, pB);
  float dotB = dot(pA, pC);

  if((dotA > 0.0 && dotB > 0.0) || useMask) {
    vec4 dest = texture2D(t, vUv);
    dest.rgb = c;
    // dest.rgb = mix(c, 1.0 - c, dest.a);
    // dest.a = 1.0;

    float lineScale = 100.0;
    vec2 v = vUv.xy * lineScale;
    float f = sin(v.x + v.y);
    dest.a *= 1.0 - step(abs(f), line);

    gl_FragColor = dest;
  } else {
    discard;
  }
}
