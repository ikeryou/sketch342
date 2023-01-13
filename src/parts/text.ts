import vt from '../glsl/text.vert';
import fg from '../glsl/text.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector2 } from 'three/src/math/Vector2';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { MyObject3D } from "../webgl/myObject3D";
import { TexLoader } from '../webgl/texLoader';
import { Conf } from '../core/conf';
import { Func } from '../core/func';
import { MousePointer } from '../core/mousePointer';
import { Util } from '../libs/util';

export class Text extends MyObject3D {

  private _mesh: Mesh;
  private _scale: number = 1;
  private _noise: Vector2 = new Vector2(Util.instance.range(1), Util.instance.range(1));

  constructor(opt: {color: Color, useMask: boolean, scale: number}) {
    super();

    this._scale = opt.scale;

    const tex = TexLoader.instance.get(Conf.instance.PATH_IMG + 'tex-text.png');

    this._mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        depthTest:false,
        uniforms:{
          useMask:{value:!opt.useMask},
          t:{value:tex},
          c:{value:opt.color},
          ma:{value:new Vector2(0, 0)},
          mb:{value:new Vector2(0.5, 1)},
          mc:{value:new Vector2(0.75, 0)},
          line:{value:Util.instance.random(0, 0.75)},
        }
      })
    )
    this.add(this._mesh);
  }

  public setMask(p1: Vector2, p2: Vector2, p3: Vector2):void {
    const uni = this._getUni(this._mesh);
    uni.ma.value.copy(p1);
    uni.mb.value.copy(p2);
    uni.mc.value.copy(p3);
  }

  protected _update():void {
    super._update();

    let s = Math.max(Func.instance.sw(), Func.instance.sh()) * 0.5;
    s *= this._scale;

    this._mesh.scale.set(s, s, 1);

    const mx = MousePointer.instance.easeNormal.x * this._noise.x;
    const my = MousePointer.instance.easeNormal.y * this._noise.x;

    const center = new Vector2(
      Util.instance.map(mx * -1, 0, 1, -1, 1),
      Util.instance.map(my, 0, 1, -1, 1),
    );
    const rangeA = Util.instance.map(this._noise.y, -1, 1, -1, 1) * mx * 5;
    const rangeB = Util.instance.map(this._noise.x, -1, 1, -1, 1) * my * 5;
    this.setMask(
      new Vector2(center.x - rangeA, center.y - rangeA),
      new Vector2(center.x - my, center.y + rangeB),
      new Vector2(center.x + rangeA, center.y - rangeB)
    );

    this.position.x = s * 1 * mx;
    this.position.y = s * 0 * my;
  }
}