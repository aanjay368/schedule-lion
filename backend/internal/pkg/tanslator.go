package pkg

import (
	"github.com/go-playground/locales/id"
	ut "github.com/go-playground/universal-translator"
	id_translations "github.com/go-playground/validator/v10/translations/id"
	"github.com/go-playground/validator/v10"
)

func NewTranslator() ut.Translator {
	locale := id.New()
	uni    := ut.New(locale, locale)

	trans, _ := uni.GetTranslator("id")
	return trans
}

func RegisterDefaultTranslations(v *validator.Validate, trans ut.Translator) {
	id_translations.RegisterDefaultTranslations(v, trans)
}


type translationEntry struct {
	tag            string
	message        string
	withFieldParam bool
}

func RegisterTranslations(v *validator.Validate, trans ut.Translator) {
	entries := []translationEntry{
		{
			tag:            "unique_nickname",
			message:        "Nama panggilan sudah terpakai, silakan gunakan nama panggilan lain",
			withFieldParam: true,
		},
		{
			tag:            "unique_username",
			message:        "Username sudah terpakai, silakan gunakan username lain",
			withFieldParam: true,
		},
		{
			tag:            "exist_division",
			message:        "Divisi tidak ditemukan",
			withFieldParam: false,
		},
		{
			tag:            "exist_position",
			message:        "Posisi tidak ditemukan",
			withFieldParam: false,
		},
		{
			tag:            "sync_division_position",
			message:        "Posisi tidak sesuai dengan divisi yang dipilih",
			withFieldParam: false,
		},
		{
			tag:            "alpha_space_dot",
			message:        "{0} hanya boleh mengandung huruf, spasi, dan titik",
			withFieldParam: true,
		},
		{
			tag:            "unique_shift_name",
			message:        "Nama shift sudah digunakan pada divisi dan posisi tersebut",
			withFieldParam: false,
		},
		{
			tag:            "unique_shift_code",
			message:        "Kode shift sudah digunakan pada divisi dan posisi tersebut",
			withFieldParam: false,
		},
		{
			tag:            "is_last_flight",
			message:        "Jam selesai harus dikosongkan untuk Last Flight",
			withFieldParam: false,
		},
	}

	for _, e := range entries {
		registerTranslation(v, trans, e)
	}
}

func registerTranslation(v *validator.Validate, trans ut.Translator, entry translationEntry) {
	v.RegisterTranslation(
		entry.tag,
		trans,
		func(ut ut.Translator) error {
			return ut.Add(entry.tag, entry.message, true)
		},
		func(ut ut.Translator, fe validator.FieldError) string {
			var t string
			if entry.withFieldParam {
				t, _ = ut.T(entry.tag, fe.Field())
			} else {
				t, _ = ut.T(entry.tag)
			}
			return t
		},
	)
}