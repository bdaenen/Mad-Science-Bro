function debug() {
  var script = document.createElement('script'); script.src = "http://netcell.github.io/phaser-inspector/build/phaser-inspector.js"; document.getElementsByTagName('head')[0].appendChild(script); function phaserInspectorInject(){ if (Phaser.Plugin.Inspector) Phaser.GAMES[0].plugins.add(Phaser.Plugin.Inspector); else setTimeout(phaserInspectorInject); } setTimeout(phaserInspectorInject);
};
