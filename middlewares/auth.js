import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

export default function configurePassport(passport, getUserByPhone) {
  passport.use(
    new LocalStrategy({ usernameField: "phone" }, async function (
      phone,
      password,
      done
    ) {
      const user = await getUserByPhone(phone);
      if (user == null) {
        return done(null, false, {
          message: "No user with that phone & password",
        });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Phone & Password incorrect!" });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.phone);
  });

  passport.deserializeUser(function (phone, done) {
    return done(null, getUserByPhone(phone));
  });
}
