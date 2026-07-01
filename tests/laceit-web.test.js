const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const proHtmlPath = path.join(__dirname, '..', 'lace-pro.html');
const proHtml = fs.existsSync(proHtmlPath) ? fs.readFileSync(proHtmlPath, 'utf8') : '';

test('web UI removes animation and microphone driven controls', () => {
  [
    'id="cb-anim"',
    'id="sl-aspeed"',
    'id="cb-sound"',
    'id="sound-viz"',
    'getUserMedia',
    'AudioContext',
    'setSoundStatus',
    "animate:'Animate'",
    "sound:'Sound'"
  ].forEach((needle) => {
    assert.equal(html.includes(needle), false, `${needle} should be removed`);
  });
});

test('image contour extraction suppresses background and border artifacts', () => {
  [
    'function estimateBackgroundProfile',
    'function buildSubjectMask',
    'function filterContourCandidates',
    'subjectMask[pi2]',
    'touchesBorder',
    'rectangularity'
  ].forEach((needle) => {
    assert.equal(html.includes(needle), true, `${needle} should be present`);
  });
});

test('image mode adds a subtle detail edge layer for better likeness', () => {
  [
    'function extractDetailEdges',
    'kind:"edge"',
    "layer.kind==='edge'",
    'edgeThreshold'
  ].forEach((needle) => {
    assert.equal(html.includes(needle), true, `${needle} should be present`);
  });
});

test('image mode supports detail strength, sampled colors, and dimensional strokes', () => {
  [
    'id="sl-detail"',
    'detail:\'Detail\'',
    'function sampleImageColor',
    'sourceColor',
    'function strokeDimensionalPath',
    'shadowColor'
  ].forEach((needle) => {
    assert.equal(html.includes(needle), true, `${needle} should be present`);
  });
});

test('palette colors still tint sampled image contours and brush modes honor background', () => {
  [
    'function blendSampleWithPalette',
    'getLayerColor(layer,li,n,pal)',
    'brush.clear(bg)',
    'drawImageLaceBrush(cx,cy,R,imgContourData,pal,tw,loose,looseStray,stray,mesh,imageRenderMode,bg)',
    'drawWithBrush(nodes,edges,connCount,maxConn,pal,tw,spacing,looseStray,bg)'
  ].forEach((needle) => {
    assert.equal(html.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab exposes raster embroidery preview controls', () => {
  [
    '<title>Embroidery Lab</title>',
    '<h1>Embroidery Lab</h1>',
    'raster studio',
    'id="pro-upload"',
    'id="pro-canvas"',
    'id="pro-cutout"',
    'id="pro-tolerance"',
    'id="pro-detail"',
    'id="pro-size"',
    'id="pro-thread"',
    'id="pro-bg"',
    'Export PNG'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  ['Lace Pro', 'MVP', 'raster MVP'].forEach((needle) => {
    assert.equal(proHtml.includes(needle), false, `${needle} should be removed`);
  });
});

test('embroidery lab can locally cut out foreground subjects before stitching', () => {
  [
    '<strong>Cutout</strong><input id="pro-cutout" type="checkbox" checked>',
    '<strong>Tolerance</strong><input id="pro-tolerance" type="range" min="24" max="112" value="64">',
    'cutout:document.getElementById(\'pro-cutout\').checked',
    'tolerance:+document.getElementById(\'pro-tolerance\').value',
    'function cleanupSubjectMask',
    'function featherSubjectMask',
    'buildSubjectMask(imageData,c.cutout,c.tolerance)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  assert.equal(proHtml.includes("tile.getContext('2d').drawImage(canvas,0,0)"), false, 'pattern tiles should not include the full square canvas background');
});

test('embroidery lab has local thread highlights, light UI, and no render button', () => {
  [
    'function drawThreadHighlight',
    'drawThreadHighlight(points,color,width,relief)',
    '--bg:#f4f0e8',
    'main{min-width:0;position:relative;overflow:hidden;background:#eee7dc}'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  ['id="pro-render"', '>Render<', "getElementById('pro-render')"].forEach((needle) => {
    assert.equal(proHtml.includes(needle), false, `${needle} should be removed`);
  });
});

test('embroidery lab supports scaling the input artwork size', () => {
  [
    '<strong>Size</strong><input id="pro-size" type="range" min="60" max="140" value="100">',
    'size:+document.getElementById(\'pro-size\').value/100',
    'var renderScale=1',
    'scale*=renderScale',
    "['pro-detail','pro-size','pro-thread','pro-relief','pro-tolerance','pro-pattern-scale','pro-pattern-gap','pro-pattern-offset']"
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  assert.equal(proHtml.includes('if(!c.patternEnabled)'), false, 'preview checkbox should not disable the pattern rendering');
});

test('embroidery lab defaults to a denser detail preview', () => {
  [
    'id="pro-detail" type="range" min="1" max="24" value="10"',
    'Math.max(1.55,8.8-c.detail*.34)',
    'skipChance=Math.max(.035,.34-c.detail*.015-edgeBoost)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab exposes explicit stitch style presets', () => {
  [
    '<strong>Stitch</strong><select id="pro-stitch-style">',
    '<option value="auto">Auto</option>',
    '<option value="running">Running</option>',
    '<option value="back">Back</option>',
    '<option value="satin">Satin</option>',
    '<option value="long-short">Long-short</option>',
    '<option value="seed">Seed</option>',
    '<option value="french-knot">French knot</option>',
    '<option value="chain">Chain</option>',
    '<option value="blanket">Blanket</option>',
    '<option value="cross">Cross</option>',
    '<option value="tatami">Tatami</option>',
    'stitchStyle:document.getElementById(\'pro-stitch-style\').value',
    "document.getElementById('pro-stitch-style').addEventListener('change',renderEmbroidery)"
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab has a unified hand stitch renderer registry', () => {
  [
    'var stitchRegistry={',
    'running:drawRunningStitch',
    'back:drawBackStitch',
    'satin:drawSatinStitch',
    "'long-short':drawLongShortStitch",
    'seed:drawSeedStitch',
    "'french-knot':drawFrenchKnot",
    'chain:drawChainStitch',
    'blanket:drawBlanketStitch',
    'cross:drawCrossKernelStitch',
    'plus:drawPlusStitch',
    'tatami:drawTatamiStitch',
    'function drawRunningStitch',
    'function drawBackStitch',
    'function drawSatinStitch',
    'function drawLongShortStitch',
    'function drawSeedStitch',
    'function drawFrenchKnot',
    'function drawBlanketStitch',
    'function drawChainStitch',
    'function drawTatamiStitch',
    'stitchRegistry[kernel]||stitchRegistry.cross'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab routes region strategy through the selected stitch style', () => {
  [
    'function resolveStitchKernel',
    'function regionStitchStrategy(region,detail,stitchStyle)',
    "if(stitchStyle&&stitchStyle!=='auto')",
    'resolveStitchKernel(stitchStyle,region,detail)',
    'var strategy=regionStitchStrategy(region,c.detail,c.stitchStyle)',
    'regionStitchStrategy(region,10,\'auto\').base'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab makes contour stitching a selectable strategy instead of default chain', () => {
  [
    '<strong>Contour</strong><select id="pro-contour-style"><option value="back" selected>Back</option>',
    '<option value="none">None</option>',
    '<option value="running">Running</option>',
    '<option value="chain">Chain</option>',
    '<option value="blanket">Blanket</option>',
    'contourStyle:document.getElementById(\'pro-contour-style\').value',
    "document.getElementById('pro-contour-style').addEventListener('change',renderEmbroidery)",
    'function drawContourStitches',
    'if(c.contourStyle===\'none\')return',
    'generateContourPlanStitches(plan,contourGuideLines',
    'drawKernelStitch(c.contourStyle'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  assert.equal(
    proHtml.includes('drawDoubleContourChainStitches(contourGuideLines,regions,bounds,c.colors,c,field);'),
    false,
    'chain contours should not be hard-coded at render end'
  );
});

test('embroidery lab exposes stitch plan controls and metadata', () => {
  [
    '<strong>Seed</strong><input id="pro-seed" type="number" value="8"',
    '<strong>Count</strong><span id="pro-stitch-count">0</span><span></span>',
    '<button id="pro-regenerate">Regenerate</button>',
    '<button id="pro-export-json">Export JSON</button>',
    'randomSeed:+document.getElementById(\'pro-seed\').value||8',
    'document.getElementById(\'pro-seed\').addEventListener(\'change\',renderEmbroidery)',
    "document.getElementById('pro-regenerate').addEventListener('click'",
    "document.getElementById('pro-export-json').addEventListener('click'",
    'download=\'embroidery-plan.json\'',
    'function updateStitchCount'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab supports palette presets while preserving custom colors', () => {
  [
    '<strong>Preset</strong><select id="pro-palette-preset">',
    '<option value="swallow">Swallow</option>',
    '<option value="goldwork">Goldwork</option>',
    '<option value="botanical">Botanical</option>',
    '<option value="monogram">Monogram</option>',
    '<option value="custom">Custom</option>',
    'var embroideryPalettes={',
    'function applyPalettePreset',
    'function setPalettePresetCustom',
    "document.getElementById('pro-palette-preset').addEventListener('change'",
    "['pro-bg','pro-c1','pro-c2','pro-c3'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){setPalettePresetCustom();renderEmbroidery()})})",
    'palettePreset:document.getElementById(\'pro-palette-preset\').value',
    'palettePreset:c.palettePreset',
    'palette:{c1:document.getElementById(\'pro-c1\').value'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab generates and renders an explicit stitch plan', () => {
  [
    'var currentStitchPlan=null',
    'function stitchDensityScale',
    'function addPlanStitch',
    'function generateContourPlanStitches',
    'function generateAccentPlanStitches',
    'function generateStitchPlan',
    'function renderStitchPlan',
    'currentStitchPlan=generateStitchPlan(regions,mask,field,bounds,c,imageData,guideLines,contourGuideLines)',
    'renderStitchPlan(currentStitchPlan,bounds,c)',
    'plan.stitches.forEach(function(stitch)',
    'drawKernelStitch(stitch.kernel,stitch.x,stitch.y,stitch.angle,stitch.len,stitch.color,stitch.width,stitch.relief,bounds)',
    'densityScale=stitchDensityScale(kernel)',
    'meta:{detail:c.detail,stitchStyle:c.stitchStyle,contourStyle:c.contourStyle,seed:c.randomSeed,palettePreset:c.palettePreset'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab renders a finer layered knit background texture', () => {
  [
    'function drawKnitColumn',
    'function drawKnitFiber',
    'var s=textureScale||1',
    'ctx.globalAlpha=s<1?.48:.62',
    'for(var x=-24*s;x<canvas.width+28*s;x+=11*s)',
    'for(var y=-24*s;y<canvas.height+30*s;y+=16*s)',
    "ctx.strokeStyle=rgbToCss(shade(base,-22+rand()*8))",
    'ctx.globalAlpha=.7',
    'ctx.strokeStyle=rgbToCss(shade(base,94+rand()*42))',
    'ctx.strokeStyle=rgbToCss(shade(base,72+rand()*34))',
    'drawKnitColumn(x+offset,y,base,s)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  assert.equal(proHtml.includes('createLinearGradient'), false, 'background should not use a sweep light gradient');
});

test('embroidery lab boosts material highlights with specular thread accents', () => {
  [
    'function drawThreadSpecular',
    'drawThreadSpecular(points,color,width,relief)',
    'var specular=.04+light*.22+relief*.035',
    'shade(color,88+light*76)',
    'ctx.lineWidth=Math.max(.28,width*.11)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab makes regenerate visibly change the stitch plan seed', () => {
  [
    'function nextRegenerateSeed',
    'Math.floor(Date.now()%9973)',
    'input.value=String(nextRegenerateSeed(+input.value||8))',
    "document.getElementById('pro-status').textContent='Regenerated #'+input.value",
    'variant:rand()',
    'var jitterX=(rand()-.5)*spacing*.32',
    'var jitterY=(rand()-.5)*spacing*.32',
    'x:x+jitterX,y:y+jitterY'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab previews the embroidery as a tiled fabric pattern', () => {
  [
    '<canvas id="pro-pattern-canvas" width="1200" height="1200"></canvas>',
    '<div class="workspace" id="pro-workspace">',
    '<section class="pattern-drawer" id="pro-pattern-drawer" aria-label="Pattern preview drawer">',
    '<button class="drawer-toggle" id="pro-pattern-drawer-toggle" type="button" aria-expanded="true">Pattern</button>',
    '#stage{position:relative;width:min(46vw,656px,86vh);aspect-ratio:1;display:flex;align-items:center;justify-content:center}',
    '.drawer-toggle{position:absolute;left:-32px;',
    '.workspace{height:100vh;width:100%;display:grid;grid-template-columns:minmax(420px,1fr) minmax(380px,42vw)',
    '.workspace.drawer-collapsed{grid-template-columns:minmax(420px,1fr) 0}',
    '.pattern-drawer.drawer-collapsed{background:transparent;border-left:0;box-shadow:none}',
    '#pro-pattern-canvas{width:100%;height:100%;object-fit:cover;border-radius:0;background:#070707}',
    '.export-frame{position:absolute;left:50%;top:50%;width:var(--export-frame-width,58%);aspect-ratio:var(--export-frame-ratio,1);',
    'box-shadow:0 0 0 9999px rgba(0,0,0,.18)',
    '<div id="pattern-stage"><canvas id="pro-pattern-canvas" width="1200" height="1200"></canvas><div class="export-frame" id="pro-export-frame"></div></div>',
    '<div class="label">Pattern</div>',
    '<strong>Preview</strong><input id="pro-pattern-enabled" type="checkbox" checked>',
    '<strong>Mode</strong><select id="pro-pattern-mode">',
    '<option value="grid">Grid</option>',
    '<option value="brick">Brick</option>',
    '<option value="half-drop">Half Drop</option>',
    '<option value="mirror-x">Mirror X</option>',
    '<option value="mirror-y">Mirror Y</option>',
    '<option value="mirror-xy">Mirror XY</option>',
    '<strong>Scale</strong><input id="pro-pattern-scale" type="range" min="20" max="240" value="62">',
    '<strong>Gap</strong><input id="pro-pattern-gap" type="range" min="-160" max="260" value="0">',
    '<strong>Offset</strong><input id="pro-pattern-offset" type="range" min="-150" max="150" value="50">',
    '<strong>Export</strong><select id="pro-pattern-format"><option value="square">Square</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>',
    '<strong>Output</strong><select id="pro-pattern-multiplier"><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option></select>',
    '<button id="pro-export-pattern">Export Pattern</button>',
    'patternPreview:document.getElementById(\'pro-pattern-enabled\').checked',
    'patternMode:document.getElementById(\'pro-pattern-mode\').value',
    'patternScale:+document.getElementById(\'pro-pattern-scale\').value/100',
    'patternGap:+document.getElementById(\'pro-pattern-gap\').value',
    'patternOffset:+document.getElementById(\'pro-pattern-offset\').value/100',
    'patternFormat:document.getElementById(\'pro-pattern-format\').value',
    'patternMultiplier:+document.getElementById(\'pro-pattern-multiplier\').value',
    'function renderPatternPreview',
    'function renderPatternToContext',
    'function drawPatternTile',
    'function drawPatternTileTo',
    'function createTransparentPatternTile',
    'var currentPatternBounds=null',
    'currentPatternBounds=bounds',
    'renderStitchPlan(currentStitchPlan,currentPatternBounds,c)',
    'drawKnitBackground(c.bg,targetCtx,width,height,.48)',
    'renderPatternToContext(patternCtx,patternCanvas.width,patternCanvas.height,c)',
    'var tileSize=Math.max(70,width*c.patternScale*.34)',
    'function patternExportSize',
    'var presets={square:[2048,2048],portrait:[1440,2560],landscape:[2560,1440]}',
    'function updateExportFrame',
    'frame.hidden=!c.patternPreview',
    "frame.style.setProperty('--export-frame-ratio',String(ratio))",
    "frame.style.setProperty('--export-frame-width',c.patternFormat==='portrait'?'42%':c.patternFormat==='landscape'?'72%':'58%')",
    "document.getElementById('pro-pattern-format').addEventListener('change',function(){updateExportFrame(getControls())})",
    "document.getElementById('pro-pattern-multiplier').addEventListener('change',function(){updateExportFrame(getControls())})",
    'updateExportFrame(c)',
    'function exportPatternPng',
    "var frameRatio={square:{w:.58,h:.58},portrait:{w:.42,h:.42/(1440/2560)},landscape:{w:.72,h:.72/(2560/1440)}}[c.patternFormat]||{w:.58,h:.58}",
    'renderPatternToContext(scene.getContext(\'2d\',{willReadFrequently:true}),scene.width,scene.height,c)',
    'drawImage(scene,sx,sy,size.width,size.height,0,0,size.width,size.height)',
    "a.download='embroidery-pattern-'+c.patternFormat+'-'+c.patternMultiplier+'x.png'",
    "document.getElementById('pro-export-pattern').addEventListener('click',exportPatternPng)",
    "document.getElementById('pro-pattern-enabled').addEventListener('change',function(){updateExportFrame(getControls())})",
    'function setPatternDrawer',
    "workspace.classList.toggle('drawer-collapsed',collapsed)",
    "document.getElementById('pro-pattern-drawer-toggle').addEventListener('click'",
    'renderPatternPreview(c)',
    "['pro-detail','pro-size','pro-thread','pro-relief','pro-tolerance','pro-pattern-scale','pro-pattern-gap','pro-pattern-offset']"
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab includes segmentation, direction field, and thread brush pipeline', () => {
  [
    'function buildSubjectMask',
    'function makeRegionMap',
    'function directionAt',
    'function drawThreadStroke',
    'function renderEmbroidery',
    'function drawKnitBackground'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab constrains stitches to image structure', () => {
  [
    'function kMeansColors',
    'function computeGradientField',
    'function extractGuideLines',
    'function traceThreadPath',
    'if(!mask[ni]||regions.map[ni]!==region)break',
    'drawGuideLines(guideLines'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab traces coherent guide components and orients nearby stitches', () => {
  [
    'function traceGuideComponents',
    'function sortComponentAlongAxis',
    'function orderComponentPath',
    'function nearestGuideAngle',
    'guideInfluence',
    'extractGuideLines(regions,mask,field,c.detail)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab orders chain contours by neighboring path tangents', () => {
  [
    'orderComponentPath(comp)',
    'function endpointScore',
    'nearestUnusedNeighbor',
    'components.push(orderComponentPath(comp))'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab path ordering uses local neighbor indexes for uploaded images', () => {
  [
    'function pointKey',
    'function buildPointIndex',
    'var neighborOffsets',
    'nearestUnusedNeighbor(point,points,used,lastAngle,index)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
  assert.equal(proHtml.includes('points.forEach(function(p){\n    if(p===point)return;'), false, 'endpoint scoring should not scan every point for every point');
});

test('embroidery lab renders contours as short double-strand cross stitches', () => {
  [
    'function drawCrossStitch',
    'function drawDoubleStrand',
    'drawContourCrossStitches(guideLines',
    'var stitchLen=Math.max(2.7,7.2-c.detail*.19)',
    'var fillLen=(2.05+c.detail*.22)*(region===1?1.04:1)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab uses x stitches for fill as well as contours', () => {
  [
    'function drawFillCrossStitch',
    'drawFillCrossStitch(x,y,angle,fillLen',
    'var fillStitchWidth=width*canvasPoint(x,y,bounds)[2]/6',
    'drawContourCrossStitches(guideLines'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab stabilizes dense stitches with plus/x kernels and chain contours', () => {
  [
    'function quantizeStitchAngle',
    'function chooseKernelType',
    'function drawPlusStitch',
    'function drawKernelStitch',
    'function drawChainLink',
    'function drawContourChainStitches',
    'drawContourChainStitches(guideLines',
    "kernel==='plus'"
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab separates chain contours from low-luminance texture guides', () => {
  [
    'function isSilhouetteEdge',
    'function extractContourGuideLines',
    'var contourGuideLines=extractContourGuideLines(regions,mask,field,c.detail)',
    'generateContourPlanStitches(plan,contourGuideLines'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab draws chain stitches only on the outer silhouette', () => {
  [
    'if(isSilhouetteEdge(mask,w,i))edgeMask[i]=1',
    'function isCleanColorBoundary'
  ].forEach((needle, index) => {
    assert.equal(proHtml.includes(needle), index === 0, `${needle} silhouette-only expectation`);
  });
});

test('embroidery lab supports double chain contours, region stitch strategies, and edge-weighted density', () => {
  [
    'function regionStitchStrategy',
    'function edgeDensityBoost',
    'function drawDoubleContourChainStitches',
    'drawContourChainStitches(guideLines,regions,bounds,colors,c,field,{offset:-1.9',
    'drawContourChainStitches(guideLines,regions,bounds,colors,c,field,{offset:1.35',
    'edgeBoost=edgeDensityBoost(guideInfluence,c.detail)',
    'var strategy=regionStitchStrategy(region,c.detail,c.stitchStyle)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});

test('embroidery lab adds premium polish with light direction, contour rhythm, and accent details', () => {
  [
    'var lightDir={x:-.55,y:-.82}',
    'function lightingAmount',
    'function contourRhythm',
    'function detectAccentPoints',
    'function drawAccentDetails',
    'drawAccentDetails(regions,mask,field,bounds,c,imageData)',
    'var rhythm=contourRhythm(prev,p,next,field,idx)',
    'var light=lightingAmount(angle)'
  ].forEach((needle) => {
    assert.equal(proHtml.includes(needle), true, `${needle} should be present`);
  });
});
