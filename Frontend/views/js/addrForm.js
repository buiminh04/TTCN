document.addEventListener("DOMContentLoaded", function () {
  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");

  // Tải tỉnh/ thành phố
  fetch("https://provinces.open-api.vn/api/?depth=1")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((province) => {
        const opt = document.createElement("option");
        opt.value = province.code;
        opt.text = province.name;
        provinceSelect.add(opt);
      });
    });

  // Tải quận/huyện khi tỉnh được chọn
  provinceSelect.addEventListener("change", () => {
    const provinceCode = provinceSelect.value;
    districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
    wardSelect.innerHTML = '<option value="">Chọn Xã/Phường</option>';
    wardSelect.disabled = true;

    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        data.districts.forEach((district) => {
          const opt = document.createElement("option");
          opt.value = district.code;
          opt.text = district.name;
          districtSelect.add(opt);
        });
        districtSelect.disabled = false;
      });
  });

  // tải xã/phường khi quận/huyện được chọn
  districtSelect.addEventListener("change", () => {
    const districtCode = districtSelect.value;
    wardSelect.innerHTML = '<option value="">Chọn Xã/Phường</option>';

    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        data.wards.forEach((ward) => {
          const opt = document.createElement("option");
          opt.value = ward.code;
          opt.text = ward.name;
          wardSelect.add(opt);
        });
        wardSelect.disabled = false;
      });
  });
});
