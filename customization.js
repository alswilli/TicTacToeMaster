function remove(id) {
	var removeTarget = document.getElementById(id);
	removeTarget.style.display = "none";
}
function removeGrayScale(id) {
  var element = document.getElementById(id);
  element.classList.remove("w3-grayscale-max");
}
function unlock(tagId, buttonId, imageId){
	remove(tagId);
	remove(buttonId);
	removeGrayScale(imageId);
}