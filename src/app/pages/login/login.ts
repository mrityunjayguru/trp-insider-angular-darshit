import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpVisible = false;
  otpBoxes = Array(6);
  otp: string[] = Array(6).fill('');

  timer: number = 0;
  intervalId: any;

  errorMessage: string = '';
  isValidating: boolean = false;

  constructor(private ngZone: NgZone, private toastr: ToastrService) { }

  ngOnInit() {

  }

  ngOnDestroy() {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  showOtp() {
    this.otpVisible = true;
    this.startTimer();

    setTimeout(() => {
      this.focusOtpInput(0);
    }, 100);
  }

  startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.timer = 60;

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.timer--;

          if (this.timer <= 0) {
            this.timer = 0;
            clearInterval(this.intervalId);
            this.intervalId = null;
          }
        });
      }, 1000);
    });
  }

  resendOtp() {

    this.otp = Array(6).fill('');

    this.errorMessage = '';
    if (this.otpInputs) {
      this.otpInputs.forEach(input => {
        input.nativeElement.value = '';
      });
    }

    alert("OTP Resent Successfully");
    this.startTimer();
    setTimeout(() => {
      this.focusOtpInput(0);
    }, 100);
  }

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    if (this.errorMessage) {
      this.errorMessage = '';
    }
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otp[index] = value;
    if (value && index < 5) {
      this.focusOtpInput(index + 1);
    }
    if (index === 5 && value) {
      this.validateOtp();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {

        this.focusOtpInput(index - 1);
      } else {

        this.otp[index] = '';
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      this.focusOtpInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusOtpInput(index + 1);
    }
  }

  focusOtpInput(index: number) {
    if (this.otpInputs && this.otpInputs.toArray()[index]) {
      this.otpInputs.toArray()[index].nativeElement.focus();
    }
  }

  getOtpValue(): string {
    return this.otp.join('');
  }

  validateOtp() {
    const otpValue = this.getOtpValue();

    if (otpValue.length === 6) {
      this.isValidating = true;
      this.errorMessage = '';

      console.log('OTP Entered:', otpValue);

      setTimeout(() => {
        this.isValidating = false;

        if (otpValue === '123456') {
          alert('OTP Verified Successfully! ✅');

        } else {

          this.errorMessage = 'Invalid OTP. Please try again.';

          this.otp = Array(6).fill('');
          if (this.otpInputs) {
            this.otpInputs.forEach(input => {
              input.nativeElement.value = '';
            });
          }

          setTimeout(() => {
            this.focusOtpInput(0);
          }, 100);
        }
      }, 1000);
    }
  }
}
