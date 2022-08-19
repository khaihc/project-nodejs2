module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("students", {
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    student_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4 // Or DataTypes.UUIDV1
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    },
  });
  return Student;
};