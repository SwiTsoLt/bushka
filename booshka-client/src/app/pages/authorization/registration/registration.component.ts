import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { checkConfirmPasswordValidator } from './directives/checkConfirmPassword.directive';
import * as registrationModel from './models/registration.model';
import { RegistrationStore } from './registration.store';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private store$: Store<registrationModel.IRegistrationForm>,
    private registrationStore: RegistrationStore,
    private fb: FormBuilder
  ) {

  }

  public registrationForm$: Observable<registrationModel.IRegistrationForm> = this.registrationStore.form$

  public optionCityList: registrationModel.ICityList = {
    "Минск": {
      index: 1,
      regions: {
        "Центральный": {
          index: 1
        },
        "Советский": {
          index: 2
        },
        "Первомайский": {
          index: 3
        },
        "Партизанский": {
          index: 4
        },
        "Заводской": {
          index: 5
        },
        "Ленинский": {
          index: 6
        },
        "Октябрьский": {
          index: 7
        },
        "Московский": {
          index: 8
        },
        "Фрунзенский": {
          index: 9
        }
      },
    },
    "Брест": {
      "index": 2,
      regions: {
        "Барановичи": {
          index: 10
        },
        "Береза": {
          index: 11
        },
        "Белоозёрск": {
          index: 12
        },
        "Ганцевичи": {
          index: 13
        },
        "Дрогичин": {
          index: 14
        },
        "Жабинка": {
          index: 15
        },
        "Иваново": {
          index: 16
        },
        "Ивацевичи": {
          index: 17
        },
        "Каменец": {
          index: 18
        },
        "Кобрин": {
          index: 19
        },
        "Лунинец": {
          index: 20
        },
        "Ляховичи": {
          index: 21
        },
        "Малорита": {
          index: 22
        },
        "Пинск": {
          index: 23
        },
        "Пружаны": {
          index: 24
        },
        "Столин": {
          index: 25
        }
      }
    },
    "Гомель": {
      index: 3,
      regions: {
        "Брагин": {
          index: 26
        },
        "Буда-Кошелево": {
          index: 27
        },
        "Ветка": {
          index: 28
        },
        "Добруш": {
          index: 29
        },
        "Ельск": {
          index: 30
        },
        "Житковичи": {
          index: 31
        },
        "Жлобин": {
          index: 32
        },
        "Калинковичи": {
          index: 33
        },
        "Корма": {
          index: 34
        },
        "Лельчицы": {
          index: 35
        },
        "Лоев": {
          index: 36
        },
        "Мозырь": {
          index: 37
        },
        "Октябрьский": {
          index: 38
        },
        "Наровля": {
          index: 39
        },
        "Петриков": {
          index: 40
        },
        "Речица": {
          index: 41
        },
        "Рогачев": {
          index: 42
        },
        "Светлогорск": {
          index: 43
        },
        "Хойники": {
          index: 44
        },
        "Чечерск": {
          index: 45
        }
      }
    },
    "Гродно": {
      index: 4,
      regions: {
        "Березовка": {
          index: 46
        },
        "Берестовица": {
          index: 47
        },
        "Волковыск": {
          index: 48
        },
        "Вороново": {
          index: 49
        },
        "Дятлово": {
          index: 50
        },
        "Зельва": {
          index: 51
        },
        "Ивье": {
          index: 52
        },
        "Кореличи": {
          index: 53
        },
        "Лида": {
          index: 54
        },
        "Мосты": {
          index: 55
        },
        "Новогрудок": {
          index: 56
        },
        "Островец": {
          index: 57
        },
        "Ошмяны": {
          index: 58
        },
        "Свислочь": {
          index: 59
        },
        "Скидель": {
          index: 60
        },
        "Слоним": {
          index: 61
        },
        "Сморгонь": {
          index: 62
        },
        "Щучин": {
          index: 63
        }
      }
    },
    "Могилёв": {
      index: 5,
      regions: {
        "Белыничи": {
          index: 64
        },
        "Бобруйск": {
          index: 65
        },
        "Быхов": {
          index: 66
        },
        "Глуск": {
          index: 67
        },
        "Горки": {
          index: 68
        },
        "Дрибин": {
          index: 69
        },
        "Кировск": {
          index: 70
        },
        "Климовичи": {
          index: 71
        },
        "Кличев": {
          index: 72
        },
        "Краснополье": {
          index: 73
        },
        "Круглое": {
          index: 74
        },
        "Костюковичи": {
          index: 75
        },
        "Кричев": {
          index: 76
        },
        "Мстиславль": {
          index: 77
        },
        "Осиповичи": {
          index: 78
        },
        "Славгород": {
          index: 79
        },
        "Чаусы": {
          index: 80
        },
        "Чериков": {
          index: 81
        },
        "Шклов": {
          index: 82
        },
        "Хотимск": {
          index: 83
        }
      }
    },
    "Витебск": {
      index: 6,
      regions: {
        "Бешенковичи": {
          index: 84
        },
        "Барань": {
          index: 85
        },
        "Браслав": {
          index: 86
        },
        "Верхнедвинск": {
          index: 87
        },
        "Глубокое": {
          index: 88
        },
        "Городок": {
          index: 89
        },
        "Докшицы": {
          index: 90
        },
        "Дубровно": {
          index: 91
        },
        "Лепель": {
          index: 92
        },
        "Лиозно": {
          index: 93
        },
        "Миоры": {
          index: 94
        },
        "Новолукомль": {
          index: 95
        },
        "Новополоцк": {
          index: 96
        },
        "Орша": {
          index: 97
        },
        "Полоцк": {
          index: 98
        },
        "Поставы": {
          index: 99
        },
        "Сенно": {
          index: 100
        },
        "Толочин": {
          index: 101
        },
        "Ушачи": {
          index: 102
        },
        "Чашники": {
          index: 103
        },
        "Шарковщина": {
          index: 104
        },
        "Шумилино": {
          index: 105
        }
      }
    }
  }

  public optionCityKeysList: string[] = Object.keys(this.optionCityList)

  public selectedCity: string = ""
  public selectedRegion: string = ""

  public selectedOptionCityRegionsList: string[] = Object.keys(this.optionCityList[this.selectedCity.length ? this.selectedCity : this.optionCityKeysList[0]].regions)

  public cityOptionsOpen: boolean = false
  public regionOptionsOpen: boolean = false

  public registrationForm: FormGroup<registrationModel.IRegistrationControlForm> = this.fb.nonNullable.group({
    firstName: ["", [
      Validators.required
    ]],
    lastName: ["", [
      Validators.required
    ]],
    gmail: ["", [Validators.required, Validators.email]],
    password: ["", [
      Validators.required,
      checkConfirmPasswordValidator.bind(this),
      Validators.minLength(6)
    ]],
    confirmPassword: ["", [
      Validators.required,
      checkConfirmPasswordValidator.bind(this),
      Validators.minLength(6)
    ]],
    phone: ["", [
      Validators.required
    ]],
    city: ["", Validators.required],
    region: ["", Validators.required]
  })

  public registrationFormErrors: registrationModel.IRegistrationFormErrors = {
    gmail: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    region: ""
  }

  ngOnInit(): void {
  }

  public setValue(fieldName: string, value: string): void {
    this.registrationStore.setValue({ fieldName, value })
    this.registrationForm.controls[fieldName as keyof typeof this.registrationForm.controls].setValue(value)
  }

  public getConfirmPassword(): string {
    return this.registrationForm.get('confirmPassword')?.value || ''
  }

  public setConfirmPassword(val: string): void {
    this.registrationForm.controls['confirmPassword'].setValue(val)
  }

  public selectCity(cityTitle: string = this.selectedCity): void {
    this.setValue('city', cityTitle)

    if (cityTitle !== this.selectedCity) {
      this.selectedRegion = ""
      this.selectedCity = cityTitle
      this.registrationForm.controls['city'].setValue(cityTitle)
      this.registrationForm.controls['region'].setValue('')
      this.setValue('region', '')
    }

    if (this.cityOptionsOpen) {
      this.checkErrors('city')
    }

    this.selectedOptionCityRegionsList = Object.keys(this.optionCityList[this.selectedCity.length ? this.selectedCity : this.optionCityKeysList[0]].regions)
    this.cityOptionsOpen = !this.cityOptionsOpen
  }

  public selectRegion(regionTitle: string = this.selectedRegion): void {
    this.setValue('region', regionTitle)

    if (regionTitle !== this.selectedRegion) {
      this.selectedRegion = regionTitle
      this.registrationForm.controls['region'].setValue(regionTitle)
    }

    if (this.regionOptionsOpen) {
      this.checkErrors('region')
    }

    this.regionOptionsOpen = !this.regionOptionsOpen
  }

  public checkErrors(fieldName: string): void {

    const errors = this.registrationForm.controls[fieldName as keyof typeof this.registrationForm.controls].errors

    if (errors) {
      switch (Object.keys(errors)[0]) {
        case "required":
          this.registrationFormErrors[fieldName] = registrationModel.registrationFormErrorEnums.required
          break;
        case "minlength":
          this.registrationFormErrors[fieldName] = registrationModel.registrationFormErrorEnums.minLengthPassword
          break;
        case "email":
          this.registrationFormErrors[fieldName] = registrationModel.registrationFormErrorEnums.wrongField
          break;
        default:
          break;
      }
    } else {
      this.registrationFormErrors[fieldName] = ""
    }
  }

  public send(): void {
    this.registrationForm$.pipe(take(1)).subscribe(form => {
      this.registrationStore.registration(form)
    })
  }

}
