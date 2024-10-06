// シーンの作成
const scene = new THREE.Scene();

// キューブマップの読み込み
const loader = new THREE.CubeTextureLoader();
let texture = loader.load([
  "images/posx.jpg", // 右
  "images/negx.jpg", // 左
  "images/posy.jpg", // 上
  "images/negy.jpg", // 下
  "images/posz.jpg", // 前
  "images/negz.jpg", // 後
]);
scene.background = texture;

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth - 250) / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 0.1); // カメラを中心に配置

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 250, window.innerHeight); // サイドバーを除いた幅
document.getElementById("main").appendChild(renderer.domElement);

// OrbitControlsの設定
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // ズームを無効化
controls.enablePan = false; // パンを無効化
controls.rotateSpeed = -0.25; // 回転速度（負の値で左右反転）
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// エラーメッセージ表示用の要素
const errorMessage = document.getElementById("error-message");

// ウィンドウリサイズ対応
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  const width = window.innerWidth - 250; // サイドバーを除いた幅
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

// レンダリングループ
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

/**
 * 特定の面のみを更新する関数
 * @param {number} faceIndex - キューブマップの面のインデックス（0: posx, 1: negx, 2: posy, 3: negy, 4: posz, 5: negz）
 * @param {string} newImagePath - 新しい画像ファイルのパス
 */
function updateCubeFace(faceIndex, newImagePath) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    newImagePath,
    function (newTexture) {
      // テクスチャの該当する面を更新
      texture.images[faceIndex] = newTexture.image;
      texture.needsUpdate = true; // テクスチャの更新を通知
      console.log(
        `faceIndex ${faceIndex} の画像が ${newImagePath} に更新されました。`
      );
    },
    undefined,
    function (err) {
      console.error(`${newImagePath} の読み込みに失敗しました。`, err);
      // エラーメッセージを表示
      errorMessage.style.display = "block";
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 5000); // 5秒後に自動的に非表示
    }
  );
}

// サイドバーの「画像差し替え」をクリックした際の処理
document.getElementById("link1").addEventListener("click", function (event) {
  event.preventDefault(); // デフォルトのリンク動作を無効化
  updateCubeFace(5, "images/opt/negz.jpg"); // negz.jpgを更新
});

// サイドバーの「デフォルトに戻す」をクリックした際の処理
document.getElementById("link2").addEventListener("click", function (event) {
  event.preventDefault();
  updateCubeFace(5, "images/negz.jpg"); // negz.jpgをデフォルトに戻す
});
