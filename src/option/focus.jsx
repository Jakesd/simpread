console.log( "===== simpread option focus mode load =====" )

import Notify    from 'notify';
import * as util from 'util';

import ThemeSel  from 'themesel';
import Shortcuts from 'shortcuts';

const [ bgcolorstyl, bgcls ] = [ "background-color", ".ks-simpread-bg" ],
      themes = [
        "235, 235, 235, 0.9",
        "216, 216, 216, 0.9",
        "229, 221, 208, 0.9",
        "243, 234, 203, 0.9",
        "176, 192, 182, 0.9",
        "28, 31, 43, 0.9",
        "61, 66, 70, 0.9",
        "17, 18, 20, 0.9"
    ];

export default class FocusOpt extends React.Component {

    changeBgColor( bgcolor, $target ) {
        bgcolor       = $target.css( bgcolorstyl );
        const color   = getColor( bgcolor ),
              opacity = getOpacity( $( bgcls ).css( bgcolorstyl ) ),
              newval  = `rgba(${color}, ${opacity})`;
        $( bgcls ).css( bgcolorstyl, newval );
        this.props.option.bgcolor = newval;
        console.log( "this.props.option.bgcolor = ", this.props.option.bgcolor )
    }

    changeOpacity() {
        const bgcolor = $( bgcls ).css( bgcolorstyl ),
              opacity = event.target.value,
              color   = getColor( bgcolor ),
              newval  = `rgba(${color}, ${opacity / 100})`;
        if ( color ) {
            $( bgcls ).css( bgcolorstyl, newval );
            this.props.option.bgcolor = newval;
        }
        this.props.option.opacity = opacity;
        console.log( "this.props.option.opacity = ", this.props.option.opacity )
    }

    changeShortcuts( shortcuts ) {
        this.props.option.shortcuts = shortcuts;
        console.log( "this.props.option.shortcuts = ", this.props.option.shortcuts )
    }

    changExclude() {
        this.props.option.site.exclude = getExclude( event.target.value );
        console.log( "this.props.option.site.exclude = ", this.props.option.site.exclude )
    }

    changeInclude() {
        if ( util.verifyHtml( event.target.value.trim() )[0] != -1 ) this.props.option.site.include = event.target.value.trim();
        console.log( "this.props.option.site.include = ", this.props.option.site.include )
    }

    componentDidMount() {
        this.refs.opacity.value   = this.props.option.opacity;
        this.refs.exclude.value   = this.props.option.site.exclude.join( "\n") ;
        this.refs.include.value   = this.props.option.site.include;
    }

    constructor( props ) {
        super( props );
    }

    render() {
        return (
            <sr-opt-focus>
                <sr-opt-gp>
                    <sr-opt-label>主题色：</sr-opt-label>
                    <ThemeSel themes={ themes } names={ themes } theme={ getColor(this.props.option.bgcolor) + ", 0.9" } changeBgColor={ (val,target)=>this.changeBgColor(val,target) } />
                </sr-opt-gp>
                <sr-opt-gp>
                    <sr-opt-label>透明度：</sr-opt-label>
                    <sr-opt-item sr-type="opacity">
                        <input ref="opacity"
                            type="range" min="50" max="95" step="5" 
                            onChange={ ()=> this.changeOpacity() }
                        />
                    </sr-opt-item>
                </sr-opt-gp>
                <sr-opt-gp>
                    <sr-opt-label>快捷键：</sr-opt-label>
                    <sr-opt-item sr-type="shortcuts">
                        <Shortcuts shortcuts={ this.props.option.shortcuts } changeShortcuts={ val=>this.changeShortcuts(val) } />
                    </sr-opt-item>
                </sr-opt-gp>
                <sr-opt-gp>
                    <sr-opt-label>隐藏列表：</sr-opt-label>
                    <sr-opt-item sr-type="exclude">
                        <textarea ref="exclude" placeholder="每行一个，例如：<div class='xxxx'></div>" onChange={ ()=> this.changExclude() }></textarea>
                    </sr-opt-item>
                </sr-opt-gp>
                <sr-opt-gp>
                    <sr-opt-label>高亮区域：</sr-opt-label>
                    <sr-opt-item sr-type="include">
                        <input ref="include" type="text" placeholder="默认为空，自动选择高亮区域。" onChange={ ()=>this.changeInclude() } />
                    </sr-opt-item>
                </sr-opt-gp>
            </sr-opt-focus>
        )
    }
}

/**
 * Get background opacity value
 * 
 * @param  {string} background-color, e.g. rgba(235, 235, 235, 0.901961)
 * @return {string} e.g. 0.901961
 */
function getOpacity( value ) {
    const arr = value.match( /[0-9.]+(\))$/ig );
    if ( arr.length > 0 ) {
        return arr.join( "" ).replace( ")", "" );
    } else {
        return null;
    }
}

/**
 * Get background color value
 * 
 * @param  {string} background-color, e.g. rgba(235, 235, 235, 0.901961)
 * @return {string} e.g. 235, 235, 235
 */
function getColor( value ) {
    const arr = value.match( /[0-9]+, /ig );
    if ( arr.length > 0 ) {
        return arr.join( "" ).replace( /, $/, "" );
    } else {
        return null;
    }
}

/**
 * Get exclude tags
 * 
 * @param  {string} input exclude html tag, e.g.:
    <div class="article fmt article__content">
    <h1>
    <div class="col-xs-12 col-md-9 main ">
    <img id="icon4weChat" style="height: 0;width: 0;">
    <div class="wsx_fade" style="pointer-events: none;"></div>
    sdasdfas
    

    <div class="ks-simpread-bg">
 *
 * @return {array} verify success htmls
    <div class="article fmt article__content">
    <h3 id="articleHeader1">原著序</h3>
    <div class="col-xs-12 col-md-9 main ">
    <img id="icon4weChat" style="height: 0;width: 0;">
    <div class="wsx_fade" style="pointer-events: none;"></div>
    <div class="ks-simpread-bg">
 * 
 */
function getExclude( htmls ) {
    let [ list, obj ]  = [[], null ];
    const arr = htmls.trim().split( "\n" );
    for( let value of arr ) {
        if ( util.verifyHtml( value.trim() )[0] > 0 ) {
            list.push( value.trim() );
        } else {
            //new Notify().Render( 2, `当前输入【 ${value} 】错误，请重新输入。` );
        }
    }
    return list;
}
