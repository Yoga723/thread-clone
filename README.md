This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## TODO

1. Tombol profile SideBar masih menunjukkan error.
   Expected behaviour : path url seharusnya /profile/[id] dan return profile dari user tersebut
2. Buat action notification menggunakan webhook dari clerk
3. Dibagian Page Search, komponen seachnya. harus ngirim userId, pageNumber, dll tidak bisa hanya searchString. 
   Meski sudah bisa nge fetchUsers, masih belum tau cara return ke page searchnya 

## Alur Mengambil data User dari clerk dan display ke onBoarding

1. Data user(google, dll) disimpan di userData{} terletak di onboarding.
2. userData{} dikirim ke AccountProfile dimasukkan ke useForm dengna variabel form. Di spread (pake ...) ke Form component untuk bisa ditampilkan datanya. Form disini pake library shadcn.

## Mengubah data gambar

1. Saat user memasukkan gambar, event onChange akan dipanggil dan memanggil fungsi handleImage(e, field.onChange). Disini mengirim value event sebagai parameter dan field.onChange untuk menerima return/hasil dari handleImage.
2. Di handleImage terdapat fileReader untuk membaca file dari event yang diterima.
3. gambar dengan tipe FileList[{}] diubah menjadi Array[{}] dan disimpan di useState file.
4. variabel file yang dengan tipe FileList[{}] dibaca oleh fileReader membuat temp url dan mengirim datanya ke parameter fieldChange(masih belum tau apa fungsinya).
5. di fungsi onSubmit, menerima values data yang isinya object{} pengguna. pertama memastikan kalau terdapat gambar decoded base64 dari profile_photo.
6. Bila data gambar berganti maka, mulai upload data gambar menggunakan api createUploadthing untuk upload dan membuat fileUrl
