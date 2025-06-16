//不快指数を計算
function calculateDiscomfortIndex() {
    //const temperature　（シートから取得）
    //const humidity　（シートから取得）
    //const discomfortIndex = （計算式）
    return discomfortIndex;
}

//不快指数を予測(とりあえずは実装しなくてよい，とりあえずはランダムに生成)
function predictDiscomfortIndex() {
    let willWorsen = Math.random() < 0.5;
    return willWorsen;
}